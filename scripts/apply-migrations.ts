/* eslint-disable no-console */
/**
 * Apply every .sql file under supabase/migrations/ in order.
 *
 * Connection strategy (first match wins):
 *   1. process.env.DATABASE_URL          (preferred — direct Postgres URL)
 *   2. process.env.SUPABASE_DB_URL       (alias many tools use)
 *
 * To find this URL: Supabase Dashboard → Project Settings → Database →
 * Connection string → "URI" (use the pooled connection on port 6543 with
 * `?sslmode=require`, or the direct connection on 5432).
 *
 * Idempotency: each migration is wrapped in a transaction and tracked in
 * a public._migrations table so it only runs once.
 */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "pg";

const MIGRATIONS_DIR = resolve(process.cwd(), "supabase/migrations");

async function main() {
  const connectionString =
    process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    console.error(
      "\n[apply-migrations] No DATABASE_URL or SUPABASE_DB_URL set.\n" +
        "Either set one of those env vars, or paste the SQL files in\n" +
        "supabase/migrations/ into Supabase Dashboard → SQL Editor manually.\n"
    );
    process.exit(1);
  }

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("[apply-migrations] No .sql files found. Nothing to do.");
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log(`[apply-migrations] Connected. Found ${files.length} file(s).`);

  try {
    await client.query(`
      create table if not exists public._migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      );
    `);

    for (const file of files) {
      const already = await client.query(
        "select 1 from public._migrations where name = $1",
        [file]
      );
      if (already.rowCount && already.rowCount > 0) {
        console.log(`  ✔ skip   ${file} (already applied)`);
        continue;
      }

      const sql = await readFile(resolve(MIGRATIONS_DIR, file), "utf8");
      console.log(`  → apply  ${file}`);
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(
          "insert into public._migrations (name) values ($1)",
          [file]
        );
        await client.query("commit");
        console.log(`  ✔ done   ${file}`);
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }

    console.log("\n[apply-migrations] All migrations applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("\n[apply-migrations] Failed:", err);
  process.exit(1);
});

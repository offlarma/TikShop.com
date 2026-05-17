/**
 * Lightweight unit smoke tests for the pure libraries (no DB, no auth).
 * Run with: npx tsx scripts/smoke-units.ts
 */
/* eslint-disable no-console */
import {
  ugcInputSchema,
  outreachInputSchema,
  copyOptimizerInputSchema,
  buildUgcPrompt,
  buildOutreachPrompt,
  buildCopyOptimizerPrompt,
} from "../src/lib/prompts";
import { PLANS_CONFIG, getPlanConfig, PAID_PLANS } from "../src/lib/billing/plans";

let failed = 0;
function check(label: string, ok: boolean, extra = "") {
  const tag = ok ? "  ok " : "FAIL ";
  console.log(`${tag} ${label}${extra ? `  -- ${extra}` : ""}`);
  if (!ok) failed += 1;
}

async function main() {
  console.log("=== zod schemas ===");

  // UGC
  {
    const bad = ugcInputSchema.safeParse({});
    check("ugc rejects empty body", !bad.success);

    const tooShort = ugcInputSchema.safeParse({
      productName: "X",
      productDescription: "too short",
    });
    check("ugc rejects short description", !tooShort.success);

    const good = ugcInputSchema.safeParse({
      productName: "Glow Serum",
      productDescription: "Vitamin C serum that brightens dull skin",
      targetAudience: "Women 20-35",
      tone: "Energetic",
      hookStyle: "Bold statement",
      duration: "30s",
    });
    check("ugc accepts valid body", good.success);
    check(
      "ugc applies defaults when fields omitted",
      ugcInputSchema.safeParse({
        productName: "X",
        productDescription: "this is a valid description",
      }).success
    );

    const prompt = buildUgcPrompt(good.data!);
    check("ugc prompt contains product name", prompt.includes("Glow Serum"));
    check("ugc prompt contains duration", prompt.includes("30s"));
    check("ugc prompt contains hook style", prompt.includes("Bold statement"));
  }

  // Outreach
  {
    const good = outreachInputSchema.safeParse({
      brandName: "Glow Beauty Co.",
      productDescription: "Vitamin C serum for sensitive skin",
      creatorNiche: "Skincare reviewers 10-100k",
      offer: "25% commission + free product",
      channel: "Email",
      tone: "Friendly",
    });
    check("outreach accepts valid body", good.success);
    const prompt = buildOutreachPrompt(good.data!);
    check(
      "outreach prompt picks email length hint when channel=Email",
      prompt.includes("subject line")
    );
  }

  // Copy
  {
    const good = copyOptimizerInputSchema.safeParse({
      copyType: "Product Title",
      currentCopy: "Hello world",
      tone: "Bold",
    });
    check("copy accepts valid body", good.success);
    const prompt = buildCopyOptimizerPrompt(good.data!);
    check(
      "copy prompt enforces title length rule for Product Title",
      prompt.includes("≤ 80 characters")
    );
  }

  console.log("\n=== plans ===");
  check(
    "PAID_PLANS contains exactly pro+studio",
    PAID_PLANS.length === 2 &&
      PAID_PLANS.includes("pro") &&
      PAID_PLANS.includes("studio")
  );
  check(
    "free monthlyLimit < pro monthlyLimit < studio monthlyLimit",
    PLANS_CONFIG.free.monthlyLimit < PLANS_CONFIG.pro.monthlyLimit &&
      PLANS_CONFIG.pro.monthlyLimit < PLANS_CONFIG.studio.monthlyLimit
  );
  check(
    "getPlanConfig('pro').name === 'Pro'",
    getPlanConfig("pro").name === "Pro"
  );

  console.log(
    `\n${failed === 0 ? "ALL GREEN" : `${failed} FAILURE(S)`}`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

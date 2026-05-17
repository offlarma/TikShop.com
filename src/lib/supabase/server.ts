import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * `cookies()` from next/headers is async from Next 15 onwards, so this
 * function returns a Promise. Always `await createClient()` at the call
 * site.
 *
 * Uses the Supabase SSR `getAll`/`setAll` pattern (recommended since
 * @supabase/ssr v0.5+). The setters are wrapped in try/catch because
 * Server Components are not allowed to mutate cookies — those writes
 * are picked up by the matching middleware.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies; the middleware will
            // refresh the session for the next request.
          }
        },
      },
    }
  );
}

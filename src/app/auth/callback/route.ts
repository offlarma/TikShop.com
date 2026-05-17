import { NextResponse } from "next/server";

import { isDisposableEmail } from "@/lib/email-validation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Supabase Auth callback. Handles:
 *   - Email confirmation links
 *   - Password reset links
 *   - Magic link sign-ins
 *   - OAuth sign-in (Google)
 *
 * Configure your Supabase project to point the "Site URL" + redirect URLs
 * at this route, e.g. https://your-app.com/auth/callback.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const failureUrl = new URL("/login", url.origin);
      failureUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(failureUrl);
    }

    // Defense in depth: if the OAuth provider returned an email that
    // matches our disposable / temp-mail blocklist, sign the user out
    // immediately, delete the auth user (service-role) and bounce them
    // to /login with a clear error. Real Google accounts won't trip
    // this check; this only catches edge cases like Google Workspace
    // configured on a disposable domain.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email && isDisposableEmail(user.email)) {
      await supabase.auth.signOut();
      try {
        const admin = createAdminClient();
        await admin.auth.admin.deleteUser(user.id);
      } catch (err) {
        console.error(
          "[auth.callback] failed to delete disposable-email user",
          err
        );
      }
      const failureUrl = new URL("/login", url.origin);
      failureUrl.searchParams.set(
        "error",
        "Disposable or temporary email addresses are not allowed. Please use your real email."
      );
      return NextResponse.redirect(failureUrl);
    }
  }

  const target = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(new URL(target, url.origin));
}

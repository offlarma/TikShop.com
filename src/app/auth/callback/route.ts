import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Supabase Auth callback. Handles:
 *   - Email confirmation links
 *   - Password reset links
 *   - Magic link sign-ins
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
  }

  const target = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(new URL(target, url.origin));
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing";

export const metadata: Metadata = {
  title: "TikShopDrop — AI toolkit for TikTok Shop sellers",
  description:
    "TikShopDrop is an independent AI toolkit for TikTok Shop sellers: UGC script generation, affiliate outreach drafts, copy optimization, listing compliance scanning, creator matching and a margin calculator. Not affiliated with TikTok Inc.",
  openGraph: {
    title: "TikShopDrop — AI toolkit for TikTok Shop sellers",
    description:
      "Independent AI toolkit for TikTok Shop sellers: UGC scripts, affiliate outreach drafts, copy optimization, listing compliance scanning and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikShopDrop — AI toolkit for TikTok Shop sellers",
    description:
      "Independent AI toolkit for TikTok Shop sellers. Not affiliated with TikTok Inc.",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  // Defense in depth for OAuth: if Supabase's allow-list ever falls back
  // to the Site URL (this page) and parks the auth `code` here as a
  // query string, forward the whole thing to /auth/callback so the
  // session can be exchanged properly. The user never sees the landing.
  const { code, error } = await searchParams;
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`);
  }
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error)}`);
  }

  // Show the marketing page to logged-out visitors; redirect signed-in
  // users straight to their dashboard. The auth check is wrapped so the
  // landing still renders if Supabase env vars are missing or invalid.
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAuthenticated = Boolean(user);
  } catch {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}

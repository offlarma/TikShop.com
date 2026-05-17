import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "@/components/landing";

export const metadata: Metadata = {
  title: "TikShopDrop — Scale your TikTok Shop with AI",
  description:
    "TikShopDrop is the 3-in-1 AI growth suite for TikTok Shop sellers: UGC scripts, affiliate outreach and copy optimization.",
  openGraph: {
    title: "TikShopDrop — Scale your TikTok Shop with AI",
    description:
      "The 3-in-1 AI growth suite for TikTok Shop sellers. Generate viral UGC scripts, recruit affiliates and optimize copy in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikShopDrop — Scale your TikTok Shop with AI",
    description:
      "The 3-in-1 AI growth suite for TikTok Shop sellers.",
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

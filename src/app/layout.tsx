import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TikShopDrop — AI toolkit for TikTok Shop sellers",
    template: "%s · TikShopDrop",
  },
  description:
    "TikShopDrop is an independent AI toolkit for TikTok Shop sellers: UGC scripts, affiliate outreach drafts, copy optimization, violation scanner and more. Not affiliated with TikTok Inc.",
  metadataBase: new URL("https://tikshopdrop.com"),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TikShopDrop",
  url: "https://tikshopdrop.com",
  email: "hello@tikshopdrop.com",
  description:
    "Independent AI toolkit for TikTok Shop sellers. UGC script generation, affiliate outreach drafts, copy optimization, listing compliance scanning, creator matching and a margin calculator. Not affiliated with TikTok Inc.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

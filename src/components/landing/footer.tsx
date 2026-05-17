import Link from "next/link";

import { Brand } from "./brand";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Log in", href: "/login" },
  { label: "Start for Free", href: "/signup" },
];

const companyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "mailto:hello@tikshopdrop.com" },
];

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Brand size="lg" />
          <p className="max-w-xs text-sm text-muted-foreground">
            The 3-in-1 AI growth suite for TikTok Shop sellers.
          </p>
        </div>

        <FooterColumn title="Product" links={productLinks} />
        <FooterColumn title="Company" links={companyLinks} />
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <p className="text-center text-[11px] leading-relaxed">
            TikShopDrop is an independent product and is not affiliated with,
            endorsed by, or sponsored by TikTok Inc. or TikTok Shop. All
            product names, logos and brands are property of their respective
            owners.
          </p>
          <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
            <p>© {year} TikShopDrop. All rights reserved.</p>
            <p>Made for TikTok Shop sellers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

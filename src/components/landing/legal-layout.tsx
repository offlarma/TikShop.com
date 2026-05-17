import type { ReactNode } from "react";

import { LandingFooter } from "./footer";
import { LandingNavbar } from "./navbar";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  children: ReactNode;
}

export function LegalLayout({
  title,
  lastUpdated,
  intro,
  children,
}: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingNavbar />
      <main className="flex-1 py-16 sm:py-24">
        <article className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <header className="mb-12 border-b border-border/60 pb-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            {intro ? (
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                {intro}
              </p>
            ) : null}
          </header>
          <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}

/* ============================================================
 * Reusable building blocks so each legal page stays consistent
 * without pulling in @tailwindcss/typography.
 * ============================================================ */

export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number | string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        <span className="mr-3 inline-block text-muted-foreground">
          {number}.
        </span>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-5 text-base font-semibold text-foreground">{children}</h3>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-muted-foreground">
      {children}
    </ul>
  );
}

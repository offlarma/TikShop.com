import { LandingCta } from "./cta";
import { LandingFeatures } from "./features";
import { LandingFooter } from "./footer";
import { LandingHero } from "./hero";
import { LandingNavbar } from "./navbar";
import { LandingPricing } from "./pricing";
import { LandingSocialProof } from "./social-proof";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingSocialProof />
        <LandingFeatures />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}

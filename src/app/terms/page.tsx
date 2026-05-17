import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalLayout,
  LegalList,
  LegalSection,
  LegalSubheading,
} from "@/components/landing/legal-layout";

const LAST_UPDATED = "May 17, 2026";
const CONTACT_EMAIL = "hello@tikshopdrop.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which you can use TikShopDrop and its AI tools.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="These Terms govern your access to and use of TikShopDrop. By creating an account or using the service you agree to these Terms. If you do not agree, do not use the service."
    >
      <LegalSection id="agreement" number={1} title="Agreement to these Terms">
        <p>
          These Terms of Service (the &quot;Terms&quot;) are a binding
          agreement between you and{" "}
          <strong>[Your legal business name]</strong> (&quot;TikShopDrop&quot;,
          &quot;we&quot;, &quot;our&quot; or &quot;us&quot;) regarding your
          access to and use of the TikShopDrop platform, dashboard and AI
          tools (the &quot;Service&quot;).
        </p>
        <p>
          Please also read our{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            Privacy Policy
          </Link>
          , which is incorporated into these Terms by reference.
        </p>
      </LegalSection>

      <LegalSection id="service" number={2} title="The Service">
        <p>
          TikShopDrop is a software-as-a-service application that provides
          AI-powered tools for TikTok Shop sellers, including UGC script
          generation, affiliate outreach drafting, copy optimization,
          violation appeals, violation scanning, creator matching and a margin
          calculator.
        </p>
        <p>
          The Service is currently offered as an MVP. Features may change, be
          added or be removed without prior notice while we iterate. We will
          give you reasonable notice for changes that materially reduce the
          value of a paid plan.
        </p>
      </LegalSection>

      <LegalSection id="accounts" number={3} title="Accounts and eligibility">
        <LegalList>
          <li>You must be at least 18 years old to create an account.</li>
          <li>
            You must provide accurate information when registering and keep it
            up to date.
          </li>
          <li>
            You are responsible for everything that happens under your
            account. Keep your password confidential.
          </li>
          <li>
            One account per person. You may not share accounts with others or
            resell your account access.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="acceptable-use" number={4} title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList>
          <li>
            Use the Service for any illegal, fraudulent or harmful purpose, or
            in violation of any TikTok Shop, OpenAI or Stripe policy.
          </li>
          <li>
            Attempt to reverse-engineer the Service, scrape its content or
            access it through automated means other than the documented
            interfaces.
          </li>
          <li>
            Use the AI tools to generate spam, harassment, defamation, hate
            speech, sexual content involving minors, or content that violates
            the rights of third parties.
          </li>
          <li>
            Submit copyrighted, confidential or personal data that you do not
            have the right to use.
          </li>
          <li>
            Resell, sublicense, white-label or commercially distribute access
            to the Service without our written permission.
          </li>
          <li>
            Probe, attack or otherwise compromise the security of the Service.
          </li>
        </LegalList>
        <p>
          We may suspend or terminate your account at any time if we believe
          you have violated these rules.
        </p>
      </LegalSection>

      <LegalSection id="billing" number={5} title="Subscriptions and billing">
        <LegalSubheading>Plans</LegalSubheading>
        <p>
          The Service offers a Free plan with a monthly generation cap and
          paid plans (Pro and Studio) with higher caps. The current plan
          details are listed on the pricing page and on{" "}
          <Link
            href="/dashboard/billing"
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            your billing dashboard
          </Link>
          .
        </p>
        <LegalSubheading>Renewals</LegalSubheading>
        <p>
          Paid subscriptions renew automatically every month at the listed
          price. You can cancel at any time from the Stripe customer portal;
          cancellation takes effect at the end of the current billing period
          and you keep access until then.
        </p>
        <LegalSubheading>Refunds</LegalSubheading>
        <p>
          Subscription fees are non-refundable except where required by law.
          If you believe you have been charged in error, contact us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <LegalSubheading>Taxes</LegalSubheading>
        <p>
          Prices are exclusive of any applicable taxes, which may be added at
          checkout depending on your billing location.
        </p>
      </LegalSection>

      <LegalSection id="ai-content" number={6} title="AI-generated content">
        <p className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <strong className="text-foreground">Important.</strong> Output
          generated by AI tools — including UGC scripts, outreach messages,
          copy variants, violation appeals, violation scans and creator
          recommendations — is generated by a large language model and may be
          inaccurate, incomplete or biased. It is your responsibility to
          review, verify and edit the output before publishing or sending it.
          TikShopDrop output is <strong>not</strong> legal, medical, financial
          or compliance advice.
        </p>
        <p>
          In particular, the Violation Scanner and Violation Appeals tools
          give estimates based on commonly enforced TikTok Shop policies but
          they do <strong>not</strong> guarantee that a listing will be
          approved or that an appeal will succeed. Always cross-check against
          the current TikTok Shop Seller Center guidelines for your market.
        </p>
        <p>
          As between you and us, you own the inputs you submit and the outputs
          generated for you, subject to the rights of the underlying AI
          provider. You grant us a limited license to process those inputs and
          outputs solely to operate the Service (e.g. store your history, show
          it back to you, generate the AI response).
        </p>
        <p>
          We may use aggregated, de-identified usage statistics (such as
          &quot;X generations created across all users this month&quot;) to
          improve and promote the Service. We will not use your individual
          prompts or outputs to train public AI models.
        </p>
      </LegalSection>

      <LegalSection
        id="ip"
        number={7}
        title="Our intellectual property"
      >
        <p>
          The Service, including the source code, design, branding (such as
          the TikShopDrop name and mark) and documentation, is owned by us and
          protected by intellectual property laws. These Terms do not grant
          you any right to use our branding outside of legitimate, descriptive
          references to the Service.
        </p>
      </LegalSection>

      <LegalSection
        id="third-parties"
        number={8}
        title="Third-party services and policies"
      >
        <p>
          The Service relies on third-party providers (Supabase, OpenAI,
          Stripe, Vercel). Your use of the Service is also subject to the
          policies of those providers. We are not responsible for outages,
          changes or actions taken by third-party providers, including model
          deprecations, rate-limit changes or payment processing decisions.
        </p>
      </LegalSection>

      <LegalSection id="termination" number={9} title="Termination">
        <p>
          You may stop using the Service at any time and delete your account
          by contacting us. We may suspend or terminate your access if you
          breach these Terms, abuse the Service or create risk to us or other
          users. On termination, your data is handled as described in our{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" number={10} title="Disclaimer of warranties">
        <p>
          The Service is provided <strong>&quot;as is&quot;</strong> and{" "}
          <strong>&quot;as available&quot;</strong>, without warranties of any
          kind, whether express or implied, including warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          or that the Service will be uninterrupted, error-free, secure or
          accurate. You use the Service at your own risk.
        </p>
      </LegalSection>

      <LegalSection
        id="liability"
        number={11}
        title="Limitation of liability"
      >
        <p>
          To the maximum extent permitted by law, in no event will
          TikShopDrop, its affiliates, officers, employees or partners be
          liable for any indirect, incidental, special, consequential or
          punitive damages, lost profits, lost revenue or lost data arising
          out of or related to your use of the Service.
        </p>
        <p>
          Our total liability to you for any claim arising out of or related
          to these Terms or the Service is limited to the greater of (a) the
          amount you paid us for the Service in the twelve months preceding
          the claim, or (b) one hundred US dollars (USD 100).
        </p>
      </LegalSection>

      <LegalSection id="indemnification" number={12} title="Indemnification">
        <p>
          You agree to indemnify and hold harmless TikShopDrop from any claim
          or demand, including reasonable legal fees, arising out of your
          breach of these Terms, your misuse of the Service or your
          publication of content generated through the Service.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" number={13} title="Governing law">
        <p>
          These Terms are governed by the laws of{" "}
          <strong>[Your jurisdiction]</strong>, without regard to its
          conflict-of-laws principles. The courts located in{" "}
          <strong>[Your jurisdiction]</strong> will have exclusive
          jurisdiction over any dispute, except where you have non-waivable
          rights as a consumer under the law of your country of residence.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={14} title="Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we do, we will
          update the &quot;Last updated&quot; date at the top of this page.
          For material changes we will notify you by email or with a notice
          inside the dashboard. Continuing to use the Service after the
          changes take effect means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={15} title="Contact us">
        <p>
          Questions about these Terms? Email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

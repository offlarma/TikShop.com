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
  title: "Privacy Policy",
  description:
    "How TikShopDrop collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Privacy Policy explains what information TikShopDrop collects, why we collect it, who we share it with and the choices you have. We try to keep this short, honest and free of legal jargon."
    >
      <LegalSection id="who-we-are" number={1} title="Who we are">
        <p>
          TikShopDrop (&quot;TikShopDrop&quot;, &quot;we&quot;, &quot;our&quot;
          or &quot;us&quot;) is an independent software-as-a-service product
          for TikTok Shop sellers. The service is operated by{" "}
          <strong>[Your legal business name]</strong>, located at{" "}
          <strong>[Your business address]</strong>. You can reach us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          <strong>TikShopDrop is not affiliated with, endorsed by, or
          sponsored by TikTok Inc. or TikTok Shop.</strong> All product
          names, logos and brands mentioned on this site or in the
          application are the property of their respective owners and are
          referenced for descriptive purposes only.
        </p>
      </LegalSection>

      <LegalSection
        id="information-we-collect"
        number={2}
        title="Information we collect"
      >
        <LegalSubheading>Account information</LegalSubheading>
        <p>
          When you create an account we collect your email address and a hashed
          version of your password. We never store passwords in plain text.
        </p>
        <LegalSubheading>Usage data</LegalSubheading>
        <p>
          When you use one of our AI tools we store the inputs you submit (e.g.
          product description, target audience), the output the AI returned
          and the time of the request, so we can show you a history of your
          generations and enforce usage limits.
        </p>
        <LegalSubheading>Payment information</LegalSubheading>
        <p>
          Payments are processed by Stripe. We never see or store your card
          details. We only receive the minimum metadata needed to manage your
          subscription (Stripe customer id, plan, status, renewal date).
        </p>
        <LegalSubheading>Technical data</LegalSubheading>
        <p>
          When you visit the site we automatically collect IP address, user
          agent and basic request metadata. We use this only to keep the
          service secure, prevent abuse and rate-limit traffic.
        </p>
        <LegalSubheading>Cookies and local storage</LegalSubheading>
        <p>
          We use a small number of strictly necessary cookies to keep you
          signed in. We do not use third-party advertising or marketing
          cookies. We may use local storage to remember UI preferences such as
          your light/dark theme.
        </p>
      </LegalSection>

      <LegalSection
        id="how-we-use"
        number={3}
        title="How we use your information"
      >
        <LegalList>
          <li>To create and maintain your account.</li>
          <li>To provide the tools you request and stream AI generations.</li>
          <li>
            To save your generation history, favorites and account preferences.
          </li>
          <li>To bill you and prevent abuse of paid plans.</li>
          <li>To enforce per-user rate limits and monthly quotas.</li>
          <li>
            To send you transactional messages about your account (e.g. email
            confirmation, password reset, invoice receipts).
          </li>
          <li>
            To improve the service in aggregated, non-identifiable ways (for
            example, to understand which features are used most).
          </li>
        </LegalList>
        <p>
          We will never sell your personal information, and we will never use
          your prompts or generations to train public AI models.
        </p>
      </LegalSection>

      <LegalSection
        id="third-parties"
        number={4}
        title="Service providers we use"
      >
        <p>
          We rely on a small number of third-party processors to operate the
          service. They are bound by their own privacy policies and only
          receive the minimum data needed to perform their function.
        </p>
        <LegalList>
          <li>
            <strong>Supabase</strong> — authentication and database hosting.{" "}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline underline-offset-2 hover:text-primary"
            >
              supabase.com/privacy
            </a>
          </li>
          <li>
            <strong>OpenAI</strong> — generates the AI output. Your prompt is
            sent to OpenAI to produce the response. According to OpenAI&apos;s
            API policy, API content is not used to train their models.{" "}
            <a
              href="https://openai.com/privacy/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline underline-offset-2 hover:text-primary"
            >
              openai.com/privacy
            </a>
          </li>
          <li>
            <strong>Stripe</strong> — handles all payments and stores card
            data on its PCI-compliant infrastructure.{" "}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline underline-offset-2 hover:text-primary"
            >
              stripe.com/privacy
            </a>
          </li>
          <li>
            <strong>Vercel</strong> — hosts the web application and edge
            network.{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground underline underline-offset-2 hover:text-primary"
            >
              vercel.com/legal/privacy-policy
            </a>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="retention" number={5} title="Data retention">
        <p>
          We keep your account data for as long as your account is active. You
          can delete individual generations at any time from the dashboard and
          delete your entire account by contacting us. After account deletion
          we will erase your personal data within 30 days, except where we are
          legally required to retain it (e.g. invoice records for tax law).
        </p>
      </LegalSection>

      <LegalSection id="your-rights" number={6} title="Your rights">
        <p>
          Depending on where you live you may have rights under the GDPR
          (European Union / UK), the CCPA (California) or similar laws,
          including the right to:
        </p>
        <LegalList>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate or outdated information.</li>
          <li>Receive an export of your data.</li>
          <li>Ask us to delete your data.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Lodge a complaint with a supervisory authority.</li>
        </LegalList>
        <p>
          To exercise any of these rights, email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
          . We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection id="security" number={7} title="How we protect your data">
        <p>
          We use industry-standard practices to keep your data safe: TLS for
          all traffic, hashed passwords managed by Supabase Auth, row-level
          security in the database so users can only see their own data, and
          access keys stored as encrypted environment secrets. No system is
          ever 100% secure, but we work hard to minimize risk.
        </p>
      </LegalSection>

      <LegalSection
        id="international-transfers"
        number={8}
        title="International transfers"
      >
        <p>
          Our service providers are based in the United States and the
          European Union. By using TikShopDrop you acknowledge that your
          information may be transferred to and processed in countries other
          than your country of residence, including the United States.
        </p>
      </LegalSection>

      <LegalSection id="children" number={9} title="Children">
        <p>
          TikShopDrop is not directed at children under 16. If we discover
          that we have collected personal information from a child under 16,
          we will delete it.
        </p>
      </LegalSection>

      <LegalSection
        id="changes"
        number={10}
        title="Changes to this policy"
      >
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will update the &quot;Last updated&quot; date at the top of this
          page. For significant changes we will notify you by email.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={11} title="Contact us">
        <p>
          For any privacy-related question or request, email us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            {CONTACT_EMAIL}
          </a>
          . You can also review our{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-2 hover:text-primary"
          >
            Terms of Service
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

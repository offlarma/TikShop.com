import "server-only";

import disposableDomains from "disposable-email-domains";

// Build a Set once at module load for O(1) lookups against ~120k domains.
const DISPOSABLE_DOMAINS: Set<string> = new Set(
  (disposableDomains as readonly string[]).map((d) => d.toLowerCase())
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

export type EmailValidation =
  | { ok: true; email: string }
  | { ok: false; reason: string };

/**
 * Validates an email address for signup or login:
 *   - non-empty + minimally well-formed
 *   - not a disposable / temp-mail domain
 *
 * Returns the normalized email on success.
 */
export function validateEmail(rawEmail: string): EmailValidation {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return { ok: false, reason: "Email is required." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, reason: "Please enter a valid email address." };
  }
  if (isDisposableEmail(email)) {
    return {
      ok: false,
      reason:
        "Disposable or temporary email addresses are not allowed. Please use your real email.",
    };
  }
  return { ok: true, email };
}

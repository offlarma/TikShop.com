/**
 * Quick sanity check that disposable-email-domains covers the most common
 * temp-mail providers and not the popular real ones. Doesn't import the
 * src/lib/email-validation.ts module directly because of its 'server-only'
 * guard — we reimplement the same tiny logic here against the same npm
 * package the production code uses.
 *
 * Run with: npx tsx scripts/smoke-email.ts
 */
/* eslint-disable no-console */
import disposableDomains from "disposable-email-domains";

const set = new Set(
  (disposableDomains as readonly string[]).map((d) => d.toLowerCase())
);

function isDisposable(email: string): boolean {
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  return set.has(email.slice(at + 1).toLowerCase().trim());
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(raw: string):
  | { ok: true; email: string }
  | { ok: false; reason: string } {
  const email = raw.trim().toLowerCase();
  if (!email) return { ok: false, reason: "Email is required." };
  if (!EMAIL_REGEX.test(email))
    return { ok: false, reason: "Please enter a valid email address." };
  if (isDisposable(email))
    return {
      ok: false,
      reason:
        "Disposable or temporary email addresses are not allowed. Please use your real email.",
    };
  return { ok: true, email };
}

let failed = 0;
function check(label: string, ok: boolean) {
  console.log(`${ok ? "  ok " : "FAIL "} ${label}`);
  if (!ok) failed += 1;
}

console.log(`Loaded ${disposableDomains.length} disposable domains.\n`);

console.log("=== disposable detection ===");
check("blocks mailinator.com", isDisposable("foo@mailinator.com"));
check("blocks 10minutemail.com", isDisposable("foo@10minutemail.com"));
check("blocks guerrillamail.com", isDisposable("foo@guerrillamail.com"));
check("blocks yopmail.com", isDisposable("foo@yopmail.com"));
check("blocks YOPMAIL.com (case-insensitive)", isDisposable("foo@YOPMAIL.com"));
check("blocks dispostable.com", isDisposable("foo@dispostable.com"));
check("blocks throwawaymail.com", isDisposable("foo@throwawaymail.com"));
check("allows gmail.com", !isDisposable("foo@gmail.com"));
check("allows outlook.com", !isDisposable("foo@outlook.com"));
check("allows yahoo.com", !isDisposable("foo@yahoo.com"));
check("allows protonmail.com", !isDisposable("foo@protonmail.com"));
check("allows custom business domain", !isDisposable("foo@tikshopdrop.com"));

console.log("\n=== validateEmail() ===");
const okCase = validate("  Foo@Gmail.com  ");
check(
  "trims + lowercases a valid email",
  okCase.ok === true && okCase.email === "foo@gmail.com"
);
check("rejects empty", validate("").ok === false);
check("rejects malformed", validate("not-an-email").ok === false);
check(
  "rejects disposable with helpful message",
  (() => {
    const r = validate("foo@mailinator.com");
    return r.ok === false && r.reason.toLowerCase().includes("disposable");
  })()
);

console.log(`\n${failed === 0 ? "ALL GREEN" : `${failed} FAILURE(S)`}`);
process.exit(failed === 0 ? 0 : 1);

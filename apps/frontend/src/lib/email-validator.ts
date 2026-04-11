import disposableDomains from "disposable-email-domains";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const disposableSet = new Set<string>(disposableDomains as string[]);

export type EmailValidation =
  | { valid: true }
  | { valid: false; reason: "format" | "disposable" };

export function validateEmail(email: string): EmailValidation {
  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return { valid: false, reason: "format" };
  }
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return { valid: false, reason: "format" };
  if (disposableSet.has(domain)) return { valid: false, reason: "disposable" };
  return { valid: true };
}

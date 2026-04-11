import crypto from "node:crypto";

const UNSUBSCRIBE_SECRET = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || "";

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

export function signUnsubscribeToken(email: string): string {
  if (!UNSUBSCRIBE_SECRET) {
    throw new Error("NEWSLETTER_UNSUBSCRIBE_SECRET is not set");
  }
  return crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(normalize(email))
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (typeof token !== "string" || !/^[a-f0-9]+$/i.test(token)) return false;
  if (!UNSUBSCRIBE_SECRET) return false;
  const expected = signUnsubscribeToken(email);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function buildUnsubscribeUrl(siteUrl: string, email: string): string {
  const token = signUnsubscribeToken(email);
  const qs = new URLSearchParams({ email: normalize(email), token });
  return `${siteUrl}/api/newsletter/unsubscribe?${qs.toString()}`;
}

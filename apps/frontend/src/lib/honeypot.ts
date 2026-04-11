export const HONEYPOT_FIELDS = ["_honey", "website_url"] as const;

/**
 * Detects bot submissions via honeypot fields.
 * A real user never fills these invisible/hidden fields.
 * Route handlers should silently return success on bot detection (don't tip off the bot).
 */
export function isBot(payload: Record<string, unknown>): boolean {
  if (!payload || typeof payload !== "object") return false;
  for (const field of HONEYPOT_FIELDS) {
    const value = payload[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Shared primitives for email templates.
 * Kept in a separate file to avoid import cycles between `index.ts`
 * (which re-exports the templates) and the templates themselves.
 */

export interface TemplateResult {
  subject: string;
  html: string;
  text?: string;
}

/**
 * HTML escape for user-provided strings in templates.
 * Lightweight — no DOM, safe for SSR edge runtime.
 */
export function esc(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

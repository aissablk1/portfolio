/**
 * Pure email template functions.
 * Each template returns { subject, html } — the subject lives with the content
 * (guarantees bilingual subjects stay in sync with their body).
 *
 * Text/plain fallback is NOT provided here — lib/email.ts auto-generates it
 * from the HTML. Only override `text` in the return if a template needs
 * legal/verbatim plain text (none currently do).
 */

export type { TemplateResult } from "./shared";
export { esc } from "./shared";

export type { Lang, ContactPayload, LeadScore } from "./contact-types";
export { labels as contactLabels } from "./contact-labels";
export type { ContactLabels } from "./contact-labels";

export { newsletterAdminTemplate } from "./newsletter-admin";
export type { NewsletterAdminData } from "./newsletter-admin";

export { newsletterWelcomeTemplate } from "./newsletter-welcome";
export type { NewsletterWelcomeData } from "./newsletter-welcome";

export { contactAdminTemplate } from "./contact-admin";
export type { ContactAdminData } from "./contact-admin";

export { contactConfirmTemplate } from "./contact-confirm";
export type { ContactConfirmData } from "./contact-confirm";

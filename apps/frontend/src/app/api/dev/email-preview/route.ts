import {
  newsletterAdminTemplate,
  newsletterWelcomeTemplate,
  contactAdminTemplate,
  contactConfirmTemplate,
} from "@/lib/email-templates";
import type { ContactPayload, LeadScore } from "@/lib/email-templates/contact-types";

function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_EMAIL_PREVIEW !== "1"
  );
}

const FAKE_NOW = "vendredi 11 avril 2026 à 18:30";

const FAKE_CONTACT: ContactPayload = {
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
  context: "Acme SARL, PME 15 salariés, secteur BTP",
  need: "Automatisation complète",
  message:
    "Bonjour, nous souhaitons automatiser notre gestion des devis et factures. " +
    "Nous utilisons actuellement Excel et perdons énormément de temps. " +
    "Pouvez-vous nous proposer une solution ?",
  budget: "7 000 € - 10 000 €",
  lang: "fr",
  plan: "accelerateur",
};

const FAKE_LEAD: LeadScore = {
  score: 68,
  label: "CHAUD",
  color: "#22c55e",
  action: "Rappeler dans les 2h. Lead prioritaire.",
};

const FAKE_UNSUB_URL =
  "https://www.aissabelkoussa.fr/api/newsletter/unsubscribe?email=preview@example.com&token=fake123";

interface PreviewEntry {
  key: string;
  label: string;
  render: () => { subject: string; html: string };
}

const previews: PreviewEntry[] = [
  {
    key: "newsletter-admin",
    label: "Newsletter — Notif admin",
    render: () =>
      newsletterAdminTemplate({
        email: "preview@example.com",
        source: "footer",
        nowFr: FAKE_NOW,
      }),
  },
  {
    key: "newsletter-welcome",
    label: "Newsletter — Bienvenue abonné",
    render: () =>
      newsletterWelcomeTemplate({
        email: "preview@example.com",
        unsubscribeUrl: FAKE_UNSUB_URL,
      }),
  },
  {
    key: "contact-admin",
    label: "Contact — Notif admin (FR, lead CHAUD)",
    render: () =>
      contactAdminTemplate({
        ...FAKE_CONTACT,
        lead: FAKE_LEAD,
        nowFr: FAKE_NOW,
      }),
  },
  {
    key: "contact-confirm",
    label: "Contact — Confirmation prospect (FR)",
    render: () =>
      contactConfirmTemplate({ ...FAKE_CONTACT, lead: FAKE_LEAD }),
  },
];

function indexPage(): string {
  const rows = previews
    .map(
      (p) =>
        `<li style="margin:12px 0;"><a href="/api/dev/email-preview?template=${p.key}" style="color:#0a0a0a;font-weight:600;text-decoration:none;">${p.label}</a><br><code style="color:#888;font-size:12px;">${p.key}</code></li>`
    )
    .join("");
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Email Preview</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 24px;">
    <h1 style="font-size:24px;margin:0 0 8px;">Email Templates Preview</h1>
    <p style="color:#666;font-size:14px;margin:0 0 24px;">Dev-only. Click a template to preview.</p>
    <ul style="list-style:none;padding:0;">${rows}</ul>
  </body></html>`;
}

export async function GET(request: Request) {
  if (isProduction()) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const templateKey = url.searchParams.get("template");

  if (!templateKey) {
    return new Response(indexPage(), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const preview = previews.find((p) => p.key === templateKey);
  if (!preview) {
    return new Response(`Unknown template: ${templateKey}`, { status: 404 });
  }

  const { subject, html } = preview.render();

  // Prepend a debug bar showing the subject
  const debugBar = `<div style="background:#fffbea;border-bottom:2px solid #facc15;padding:12px 24px;font-family:ui-monospace,monospace;font-size:12px;color:#713f12;"><strong>SUBJECT:</strong> ${subject.replace(/</g, "&lt;")}</div>`;
  const withBar = html.replace(/<body([^>]*)>/, `<body$1>${debugBar}`);

  return new Response(withBar, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

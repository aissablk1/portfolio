import type { ContactPayload, LeadScore } from "./contact-types";
import type { TemplateResult } from "./shared";
import { esc } from "./shared";
import { labels } from "./contact-labels";

export interface ContactConfirmData extends ContactPayload {
  lead: LeadScore;
}

export function contactConfirmTemplate(
  data: ContactConfirmData
): TemplateResult {
  const t = labels[data.lang] || labels.fr;
  const lead = data.lead;
  const isFr = data.lang === "fr";
  const firstName = esc(data.name.split(" ")[0]);

  // Smart intro based on lead temperature
  const smartIntro =
    lead.label === "CHAUD"
      ? isFr
        ? `Votre projet correspond exactement à ce que je fais. Je reviens vers vous <strong>dans les prochaines heures</strong> avec une proposition concrète.`
        : `Your project is a perfect fit for what I do. I'll get back to you <strong>within the next few hours</strong> with a concrete proposal.`
      : lead.label === "TIEDE"
        ? isFr
          ? `${t.confirmBody} Pour mieux préparer notre échange, vous pouvez aussi <a href="https://www.aissabelkoussa.fr/diagnostic" style="color:#16a34a;font-weight:600;">faire le diagnostic gratuit</a> — ça me permettra de vous proposer la meilleure approche.`
          : `${t.confirmBody} To better prepare our exchange, you can also <a href="https://www.aissabelkoussa.fr/diagnostic" style="color:#16a34a;font-weight:600;">take the free diagnostic</a> — it will help me propose the best approach.`
        : t.confirmBody;

  const smartPromise =
    lead.label === "CHAUD"
      ? isFr
        ? "Réponse sous 2h."
        : "Reply within 2 hours."
      : t.confirmPromise;

  const html = `<!DOCTYPE html>
<html lang="${data.lang}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="margin-bottom:32px;">
      <h1 style="color:#111;font-size:18px;margin:0;font-weight:700;">
        ${t.confirmGreeting} ${firstName},
      </h1>
    </div>

    <div style="color:#333;font-size:15px;line-height:1.8;margin-bottom:24px;">
      <p style="margin:0 0 16px;">${smartIntro}</p>
      <p style="margin:0 0 24px;font-weight:600;">${smartPromise}</p>
    </div>

    <div style="background:#f0f0f0;border-radius:12px;padding:24px;margin-bottom:32px;">
      <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 16px;">${t.confirmDetail}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;width:100px;">${t.need}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${esc(data.need)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">${t.budget}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;font-weight:600;">${esc(data.budget)}</td>
        </tr>
        ${
          data.context
            ? `<tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">${t.company}</td>
          <td style="padding:8px 0;color:#111;font-size:13px;">${esc(data.context)}</td>
        </tr>`
            : ""
        }
      </table>
    </div>

    <div style="margin-bottom:32px;">
      <p style="color:#333;font-size:15px;margin:0 0 4px;">${t.confirmClosing}</p>
      <p style="color:#111;font-size:15px;font-weight:700;margin:0;">${t.confirmSignature}</p>
      <p style="color:#888;font-size:13px;margin:4px 0 0;">${t.confirmRole}</p>
    </div>

    <div style="border-top:1px solid #e5e5e5;padding-top:20px;text-align:center;">
      <a href="https://www.aissabelkoussa.fr" style="color:#16a34a;font-size:12px;text-decoration:none;font-weight:600;">${t.confirmSite}</a>
      <span style="color:#ccc;margin:0 8px;">&bull;</span>
      <a href="https://www.linkedin.com/in/aissabelkoussa" style="color:#16a34a;font-size:12px;text-decoration:none;">LinkedIn</a>
      <span style="color:#ccc;margin:0 8px;">&bull;</span>
      <a href="https://github.com/aissablk1" style="color:#16a34a;font-size:12px;text-decoration:none;">GitHub</a>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: t.confirmSubject,
    html,
  };
}

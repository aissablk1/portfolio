import type { ContactPayload, LeadScore } from "./contact-types";
import type { TemplateResult } from "./shared";
import { esc } from "./shared";
import { labels } from "./contact-labels";

export interface ContactAdminData extends ContactPayload {
  lead: LeadScore;
  nowFr: string;
}

export function contactAdminTemplate(data: ContactAdminData): TemplateResult {
  const t = labels[data.lang] || labels.fr;
  const lead = data.lead;
  const now = data.nowFr;
  const langBadge = data.lang === "fr" ? "Francais" : "English";

  const html = `<!DOCTYPE html>
<html lang="${data.lang}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Lead Score Banner -->
    <div style="background:${lead.color}15;border:2px solid ${lead.color};border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <div style="background:${lead.color};color:#fff;font-size:12px;font-weight:800;padding:6px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:0.1em;">
        ${lead.label} (${lead.score}/100)
      </div>
      <span style="color:${lead.color};font-size:13px;font-weight:600;">
        ${lead.action}
      </span>
    </div>

    <div style="border-bottom:2px solid #222;padding-bottom:24px;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:20px;margin:0;letter-spacing:0.1em;text-transform:uppercase;">
        ${t.subject}
      </h1>
      <p style="color:#666;font-size:12px;margin:8px 0 0;text-transform:uppercase;letter-spacing:0.15em;">
        ${t.via} &bull; ${now}
      </p>
    </div>

    <!-- Reply button -->
    <div style="margin-bottom:32px;">
      <a href="mailto:${esc(data.email)}?subject=Re: ${esc(data.need)}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">
        ${t.replyNow} &rarr;
      </a>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:50%;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.name}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;font-weight:600;">${esc(data.name)}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:50%;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.email}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <a href="mailto:${esc(data.email)}" style="color:#6366f1;text-decoration:none;">${esc(data.email)}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.company}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">${esc(data.context) || t.notProvided}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.language}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:2px 10px;font-size:11px;">${langBadge}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.need}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;">
            <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:4px 14px;font-size:13px;">
              ${esc(data.need)}
            </span>
          </p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.budget}</span>
          <p style="color:#fff;font-size:16px;margin:6px 0 0;font-weight:600;">${esc(data.budget)}</p>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:16px 0;vertical-align:top;">
          <span style="color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">${t.message}</span>
          <div style="color:#ccc;font-size:15px;margin:10px 0 0;line-height:1.7;background:#111;border:1px solid #1a1a1a;border-radius:12px;padding:20px;">
            ${esc(data.message).replace(/\n/g, "<br>")}
          </div>
        </td>
      </tr>
    </table>

    <div style="margin-top:40px;padding-top:24px;border-top:2px solid #222;text-align:center;">
      <p style="color:#444;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin:0;">
        ${t.footer}
      </p>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: `${t.subject} — ${data.need} — ${data.name} (${lead.label})`,
    html,
  };
}

import type { TemplateResult } from "./shared";
import { esc } from "./shared";

const SITE_URL = "https://www.aissabelkoussa.fr";

export interface NewsletterAdminData {
  email: string;
  source: string;
  nowFr: string;
}

export function newsletterAdminTemplate(
  data: NewsletterAdminData
): TemplateResult {
  const { email, source, nowFr } = data;
  const safeEmail = esc(email);
  const safeSource = esc(source);
  const initial = email.charAt(0).toUpperCase();
  const domain = email.split("@")[1] || "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="width:8px;height:8px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 4px #16a34a20;"></div>
      <span style="color:#16a34a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Nouvel abonné newsletter</span>
    </div>

    <div style="background:linear-gradient(135deg,#16a34a10,#0a0a0a);border:1px solid #16a34a30;border-radius:16px;padding:28px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#16a34a,#0ea5e9);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:700;">${esc(initial)}</div>
        <div>
          <p style="margin:0;color:#fff;font-size:17px;font-weight:600;word-break:break-all;">${safeEmail}</p>
          <p style="margin:4px 0 0;color:#888;font-size:12px;">${esc(domain)}</p>
        </div>
      </div>
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Répondre &rarr;</a>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;width:35%;">Source</td>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:14px;">
          <span style="display:inline-block;background:#1a1a1a;border:1px solid #333;border-radius:20px;padding:3px 12px;font-size:11px;">${safeSource}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Date</td>
        <td style="padding:14px 0;border-bottom:1px solid #1a1a1a;color:#fff;font-size:14px;">${esc(nowFr)}</td>
      </tr>
      <tr>
        <td style="padding:14px 0;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Domaine</td>
        <td style="padding:14px 0;color:#fff;font-size:14px;font-family:ui-monospace,monospace;">${esc(domain)}</td>
      </tr>
    </table>

    <div style="margin-top:28px;padding:18px;background:#0f0f0f;border:1px solid #1a1a1a;border-radius:12px;">
      <p style="margin:0 0 10px;color:#666;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;">Actions rapides</p>
      <div>
        <a href="mailto:${safeEmail}?subject=Bienvenue%20dans%20la%20newsletter" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Email perso</a>
        <a href="https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(email)}" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Chercher LinkedIn</a>
        <a href="${SITE_URL}/admin" style="display:inline-block;margin:4px 0;padding:8px 14px;background:#1a1a1a;border:1px solid #333;border-radius:8px;color:#e5e5e5;font-size:12px;text-decoration:none;">Dashboard</a>
      </div>
    </div>

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;text-align:center;">
      <p style="color:#444;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;margin:0;">aissabelkoussa.fr &bull; notification automatique</p>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: `Newsletter — Nouvel inscrit : ${email}`,
    html,
  };
}

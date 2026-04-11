import type { TemplateResult } from "./shared";
import { esc } from "./shared";

const CONTACT_EMAIL = "contact@aissabelkoussa.fr";
const SITE_URL = "https://www.aissabelkoussa.fr";

export interface NewsletterWelcomeData {
  email: string;
  unsubscribeUrl: string | null;
}

export function newsletterWelcomeTemplate(
  data: NewsletterWelcomeData
): TemplateResult {
  const { email, unsubscribeUrl } = data;
  const safeEmail = esc(email);
  const unsubBlock = unsubscribeUrl
    ? `<a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline;">Se désinscrire</a>`
    : `<a href="mailto:${CONTACT_EMAIL}?subject=Désinscription%20newsletter" style="color:#999;text-decoration:underline;">Se désinscrire</a>`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <div style="margin-bottom:8px;">
      <span style="display:inline-block;padding:4px 12px;background:#0a0a0a;color:#ffffff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;border-radius:20px;">Inscription confirmée</span>
    </div>

    <h1 style="color:#0a0a0a;font-size:28px;line-height:1.2;margin:16px 0 12px;font-weight:800;letter-spacing:-0.02em;">
      Bienvenue à bord.
    </h1>
    <p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 32px;">
      Merci de rejoindre la newsletter. Un article concret chaque semaine sur l'IA, l'automatisation et la visibilité digitale pour les PME et artisans.
    </p>

    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:16px;padding:28px;margin-bottom:32px;">
      <p style="margin:0 0 16px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;">Ce que vous allez recevoir</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px;"><span style="color:#0a0a0a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">1 article par semaine</strong> — études de cas réels et playbooks opérationnels.</td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;"><span style="color:#0a0a0a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">Zéro spam, zéro pub.</strong> Que du contenu utile que vous pouvez appliquer.</td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;"><span style="color:#0a0a0a;font-size:18px;font-weight:700;">&bull;</span></td>
          <td style="padding:10px 0;color:#333;font-size:14px;line-height:1.6;"><strong style="color:#0a0a0a;">Désinscription en 1 clic</strong> — à tout moment, sans question.</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:40px;">
      <a href="${SITE_URL}/blog" style="display:inline-block;background:#0a0a0a;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;">
        Lire les derniers articles &nbsp;&rarr;
      </a>
      <a href="${SITE_URL}/diagnostic" style="display:inline-block;margin-left:8px;padding:14px 24px;color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:600;">
        Diagnostic gratuit
      </a>
    </div>

    <div style="background:#f5f5f5;border-radius:12px;padding:20px;margin-bottom:32px;">
      <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
        <strong style="color:#0a0a0a;">Besoin d'aide rapidement&nbsp;?</strong> Répondez simplement à cet email. Je lis tout, personnellement.
      </p>
    </div>

    <div style="margin-bottom:24px;">
      <p style="color:#0a0a0a;font-size:14px;font-weight:700;margin:0 0 2px;">Aïssa BELKOUSSA</p>
      <p style="color:#888;font-size:12px;margin:0;">Architecte de systèmes &amp; Consultant IA &bull; Albi</p>
    </div>

    <div style="border-top:1px solid #e5e5e5;padding-top:20px;text-align:center;">
      <div style="margin-bottom:12px;">
        <a href="${SITE_URL}" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">Site</a>
        <span style="color:#ccc;">&bull;</span>
        <a href="https://www.linkedin.com/in/aissabelkoussa" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">LinkedIn</a>
        <span style="color:#ccc;">&bull;</span>
        <a href="${SITE_URL}/blog" style="color:#666;font-size:12px;text-decoration:none;margin:0 8px;">Blog</a>
      </div>
      <p style="color:#999;font-size:11px;margin:0 0 6px;">
        Vous recevez cet email à <strong>${safeEmail}</strong> suite à votre inscription sur aissabelkoussa.fr.
      </p>
      <p style="color:#999;font-size:11px;margin:0;">
        ${unsubBlock} &bull; <a href="mailto:${CONTACT_EMAIL}" style="color:#999;text-decoration:underline;">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  return {
    subject: "Bienvenue dans la newsletter — Aïssa BELKOUSSA",
    html,
  };
}

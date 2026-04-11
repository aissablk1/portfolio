import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from html import escape as html_escape
import logging
import requests

logger = logging.getLogger(__name__)

def _branded_email(subject: str, body_html: str) -> str:
    """Encapsule un body HTML dans le template email brande."""
    return f'''<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{html_escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #222;">
    <h1 style="color:#fff;font-size:14px;letter-spacing:0.3em;margin:0;font-weight:700;">A\u00cfSSA BELKOUSSA</h1>
  </div>
  <div style="padding:32px 0;color:#e0e0e0;font-size:15px;line-height:1.7;">
    {body_html}
  </div>
  <div style="border-top:1px solid #222;padding-top:24px;text-align:center;color:#666;font-size:12px;">
    <p style="margin:0 0 8px;">
      <a href="https://linkedin.com/in/aissabelkoussa" style="color:#888;text-decoration:none;">LinkedIn</a>
      &nbsp;&middot;&nbsp;
      <a href="https://github.com/aissablk1" style="color:#888;text-decoration:none;">GitHub</a>
      &nbsp;&middot;&nbsp;
      <a href="https://aissabelkoussa.fr" style="color:#888;text-decoration:none;">Portfolio</a>
    </p>
    <p style="margin:0;color:#444;">&copy; 2026 A\u00efssa Belkoussa</p>
  </div>
</div>
</body></html>'''


class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        self.recipient_email = os.getenv('RECIPIENT_EMAIL')
        self.fallback_provider = os.getenv('EMAIL_FALLBACK_PROVIDER', 'formsubmit').lower()
        self._resend = None  # lazy init du ResendService

    def _get_resend(self):
        """Lazy init du ResendService pour éviter une dépendance d'import au démarrage."""
        if self._resend is None:
            from services.resend_service import ResendService
            self._resend = ResendService()
        return self._resend

    def _render_auto_reply_html(self, submission_data: dict) -> str:
        """Rendu du corps HTML de l'auto-reply (extrait pour réutilisation Resend + SMTP)."""
        safe_name = html_escape(str(submission_data['name']))
        safe_subject = html_escape(str(submission_data['subject']))
        whatsapp_number = os.getenv("ADMIN_WHATSAPP_NUMBER", "")
        inner_body = f"""
<h2 style="color:#fff;font-size:20px;margin:0 0 24px;">Merci pour votre message, {safe_name} !</h2>

<p>Bonjour <strong style="color:#fff;">{safe_name}</strong>,</p>
<p>Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien re&ccedil;u votre message concernant &laquo;&nbsp;<em style="color:#8b5cf6;">{safe_subject}</em>&nbsp;&raquo;.</p>

<div style="background:#161616;padding:20px;border-radius:8px;margin:24px 0;border:1px solid #222;">
  <p style="color:#fff;font-size:16px;margin:0 0 12px;font-weight:600;">Prochaines &eacute;tapes</p>
  <p style="margin:0 0 12px;">Je reviendrai vers vous dans les <strong style="color:#fff;">24-48h</strong> pour &eacute;tudier votre demande en d&eacute;tail.</p>
  <p style="margin:0 0 16px;">Pour une r&eacute;ponse plus rapide, n'h&eacute;sitez pas &agrave; me contacter directement sur WhatsApp :</p>
  <p style="text-align:center;margin:0;">
    <a href="https://wa.me/{whatsapp_number}" style="background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600;">Discuter sur WhatsApp</a>
  </p>
</div>

<div style="background:#161616;padding:20px;border-radius:8px;margin:24px 0;border-left:3px solid #8b5cf6;">
  <p style="color:#fff;font-size:16px;margin:0 0 12px;font-weight:600;">En attendant</p>
  <p style="margin:0;">N'h&eacute;sitez pas &agrave; :</p>
  <ul style="padding-left:20px;margin:8px 0 0;">
    <li style="margin:4px 0;"><a href="https://github.com/aissablk1" style="color:#8b5cf6;text-decoration:none;">Consulter mes r&eacute;alisations sur GitHub</a></li>
    <li style="margin:4px 0;"><a href="https://t.me/investwithaissa" style="color:#8b5cf6;text-decoration:none;">Suivre mon actualit&eacute; sur Telegram</a></li>
    <li style="margin:4px 0;"><a href="https://linkedin.com/in/aissabelkoussa" style="color:#8b5cf6;text-decoration:none;">Me retrouver sur LinkedIn</a></li>
  </ul>
</div>

<p style="text-align:center;color:#999;margin-top:24px;">&Agrave; tr&egrave;s bient&ocirc;t,<br><strong style="color:#fff;">A&Iuml;SSA BELKOUSSA</strong><br><span style="font-style:italic;font-size:13px;">Entrepreneur &bull; D&eacute;veloppeur &bull; Cr&eacute;ateur</span></p>"""
        return _branded_email(f"Message recu - {submission_data['subject']}", inner_body)

    def _render_html_body(self, submission_data: dict) -> str:
        safe_name = html_escape(str(submission_data['name']))
        safe_email = html_escape(str(submission_data['email']))
        safe_subject = html_escape(str(submission_data['subject']))
        safe_message = html_escape(str(submission_data['message']))
        safe_id = html_escape(str(submission_data.get('id', 'Non disponible (N/A)')))
        safe_ip = html_escape(str(submission_data.get('ip_address', 'Non disponible (N/A)')))
        whatsapp_number = os.getenv("ADMIN_WHATSAPP_NUMBER", "")
        inner_body = f"""
<h2 style="color:#fff;font-size:18px;margin:0 0 24px;">Nouveau message depuis votre portfolio</h2>

<div style="background:#161616;padding:20px;border-radius:8px;margin:0 0 24px;border:1px solid #222;">
  <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Informations du contact</p>
  <p style="margin:4px 0;"><strong style="color:#fff;">Nom :</strong> {safe_name}</p>
  <p style="margin:4px 0;"><strong style="color:#fff;">Email :</strong> <a href="mailto:{safe_email}" style="color:#8b5cf6;text-decoration:none;">{safe_email}</a></p>
  <p style="margin:4px 0;"><strong style="color:#fff;">Sujet :</strong> {safe_subject}</p>
  <p style="margin:4px 0;"><strong style="color:#fff;">Date :</strong> {datetime.now().strftime('%d/%m/%Y a %H:%M')}</p>
</div>

<div style="background:#161616;padding:20px;border-radius:8px;margin:0 0 24px;border-left:3px solid #8b5cf6;">
  <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Message</p>
  <p style="white-space:pre-wrap;margin:0;color:#e0e0e0;">{safe_message}</p>
</div>

<div style="background:#161616;padding:16px;border-radius:8px;margin:0 0 24px;border:1px solid #222;">
  <p style="margin:0;color:#999;">
    <strong style="color:#fff;">Actions rapides :</strong><br>
    <a href="mailto:{safe_email}?subject=Re: {safe_subject}" style="color:#8b5cf6;text-decoration:none;">Repondre par email</a><br>
    <a href="https://wa.me/{whatsapp_number}?text=Bonjour {safe_name}, merci pour votre message via mon portfolio." style="color:#25d366;text-decoration:none;">Contacter sur WhatsApp</a>
  </p>
</div>

<div style="color:#555;font-size:11px;">
  <p style="margin:4px 0;">ID : {safe_id}</p>
  <p style="margin:4px 0;">IP : {safe_ip}</p>
</div>"""
        return _branded_email(f"Nouveau contact - {submission_data['subject']}", inner_body)

    def _send_via_smtp(self, submission_data: dict) -> bool:
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = self.recipient_email
            msg['Subject'] = f"🔔 Nouveau contact portfolio - {submission_data['subject']}"
            msg.attach(MIMEText(self._render_html_body(submission_data), 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)

            logger.info(f"Contact notification email sent successfully to {self.recipient_email} via SMTP")
            return True
        except Exception as e:
            logger.error(f"Failed SMTP send: {str(e)}")
            return False

    def _send_via_formsubmit(self, submission_data: dict) -> bool:
        try:
            if not self.recipient_email:
                logger.warning("Recipient email missing for formsubmit provider")
                return False
            url = f"https://formsubmit.co/ajax/{self.recipient_email}"
            payload = {
                "name": submission_data['name'],
                "email": submission_data['email'],
                "subject": f"[Portfolio] {submission_data['subject']}",
                "message": submission_data['message']
            }
            headers = {"Content-Type": "application/json", "Accept": "application/json"}
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if 200 <= response.status_code < 300:
                logger.info("Contact notification sent via formsubmit.co")
                return True
            logger.error(f"Formsubmit failed: {response.status_code} {response.text}")
            return False
        except Exception as e:
            logger.error(f"Error sending via formsubmit: {str(e)}")
            return False

    def _send_via_mailthis(self, submission_data: dict) -> bool:
        try:
            if not self.recipient_email:
                logger.warning("Recipient email missing for mailthis provider")
                return False
            url = f"https://mailthis.to/{self.recipient_email}"
            data = {
                "name": submission_data['name'],
                "email": submission_data['email'],
                "_subject": f"[Portfolio] {submission_data['subject']}",
                "message": submission_data['message'],
                "_replyto": submission_data['email']
            }
            # MailThis often responds with 200/302; allow both
            response = requests.post(url, data=data, timeout=10, allow_redirects=False)
            if response.status_code in (200, 201, 202, 302):
                logger.info("Contact notification sent via mailthis.to")
                return True
            logger.error(f"MailThis failed: {response.status_code} {response.text}")
            return False
        except Exception as e:
            logger.error(f"Error sending via mailthis: {str(e)}")
            return False

    def send_contact_notification(self, submission_data: dict) -> bool:
        """Send email notification for new contact form submission.

        Chaîne : Resend → SMTP Gmail → formsubmit.co → mailthis.to.
        """
        # 1. Tentative Resend (canal principal)
        resend = self._get_resend()
        if resend.available and self.recipient_email:
            result = resend.send_email(
                to=self.recipient_email,
                subject=f"🔔 Nouveau contact portfolio - {submission_data['subject']}",
                html=self._render_html_body(submission_data),
                reply_to=submission_data.get('email'),
                tags=[{"name": "type", "value": "contact-notification"}],
            )
            if result is not None:
                logger.info(f"Contact notification sent via Resend to {self.recipient_email}")
                return True
            logger.warning("Resend a échoué pour la notif contact, fallback SMTP")

        # 2. Chaîne legacy (SMTP → formsubmit → mailthis) — INCHANGÉE
        if self.email_user and self.email_password and self.recipient_email:
            return self._send_via_smtp(submission_data)

        if self.recipient_email:
            if self.fallback_provider == 'mailthis':
                return self._send_via_mailthis(submission_data)
            return self._send_via_formsubmit(submission_data)

        logger.warning("No recipient configured; skipping email notification")
        return False
    
    def send_auto_reply(self, submission_data: dict) -> bool:
        """Send automatic reply to the person who submitted the form.

        Chaîne : Resend → SMTP Gmail. Aucun fallback HTTP car formsubmit/mailthis
        ne sont pas conçus pour envoyer vers une adresse arbitraire.
        """
        # 1. Tentative Resend (canal principal)
        resend = self._get_resend()
        if resend.available:
            result = resend.send_email(
                to=submission_data['email'],
                subject=f"✅ Message reçu - {submission_data['subject']}",
                html=self._render_auto_reply_html(submission_data),
                tags=[{"name": "type", "value": "auto-reply"}],
            )
            if result is not None:
                logger.info(f"Auto-reply sent via Resend to {submission_data['email']}")
                return True
            logger.warning("Resend a échoué pour l'auto-reply, fallback SMTP")

        # 2. Branche SMTP existante
        try:
            if not all([self.email_user, self.email_password]):
                logger.warning("Email configuration missing. Cannot send auto-reply.")
                return False

            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = submission_data['email']
            msg['Subject'] = f"✅ Message reçu - {submission_data['subject']}"  # Subject header (not HTML, no escape needed)

            body = self._render_auto_reply_html(submission_data)
            msg.attach(MIMEText(body, 'html'))
            
            # Send auto-reply
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
                
            logger.info(f"Auto-reply sent successfully to {submission_data['email']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send auto-reply: {str(e)}")
            return False
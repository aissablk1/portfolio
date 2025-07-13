import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.email_user = os.getenv('EMAIL_USER')
        self.email_password = os.getenv('EMAIL_PASSWORD')
        self.recipient_email = os.getenv('RECIPIENT_EMAIL')
        
    def send_contact_notification(self, submission_data: dict) -> bool:
        """Send email notification for new contact form submission"""
        try:
            if not all([self.email_user, self.email_password, self.recipient_email]):
                logger.warning("Email configuration missing. Cannot send notification.")
                return False
                
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = self.recipient_email
            msg['Subject'] = f"🔔 Nouveau contact portfolio - {submission_data['subject']}"
            
            # Email body
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                        📬 Nouveau message depuis votre portfolio
                    </h2>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #555; margin-top: 0;">Informations du contact</h3>
                        <p><strong>Nom :</strong> {submission_data['name']}</p>
                        <p><strong>Email :</strong> <a href="mailto:{submission_data['email']}">{submission_data['email']}</a></p>
                        <p><strong>Sujet :</strong> {submission_data['subject']}</p>
                        <p><strong>Date :</strong> {datetime.now().strftime('%d/%m/%Y à %H:%M')}</p>
                    </div>
                    
                    <div style="background: #fff; padding: 20px; border-left: 4px solid #007cba; margin: 20px 0;">
                        <h3 style="color: #555; margin-top: 0;">Message</h3>
                        <p style="white-space: pre-wrap;">{submission_data['message']}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
                        <p style="margin: 0;">
                            <strong>Actions rapides :</strong><br>
                            • <a href="mailto:{submission_data['email']}?subject=Re: {submission_data['subject']}" style="color: #007cba;">Répondre par email</a><br>
                            • <a href="https://wa.me/33782721406?text=Bonjour {submission_data['name']}, merci pour votre message via mon portfolio." style="color: #25d366;">Contacter sur WhatsApp</a>
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                        <p>ID de soumission : {submission_data.get('id', 'N/A')}</p>
                        <p>IP : {submission_data.get('ip_address', 'N/A')}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
                
            logger.info(f"Contact notification email sent successfully to {self.recipient_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send contact notification email: {str(e)}")
            return False
    
    def send_auto_reply(self, submission_data: dict) -> bool:
        """Send automatic reply to the person who submitted the form"""
        try:
            if not all([self.email_user, self.email_password]):
                logger.warning("Email configuration missing. Cannot send auto-reply.")
                return False
                
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = submission_data['email']
            msg['Subject'] = f"✅ Message reçu - {submission_data['subject']}"
            
            # Auto-reply body
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                        Merci pour votre message, {submission_data['name']} !
                    </h2>
                    
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Bonjour <strong>{submission_data['name']}</strong>,</p>
                        <p>Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien reçu votre message concernant "<em>{submission_data['subject']}</em>".</p>
                    </div>
                    
                    <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #555; margin-top: 0;">📞 Prochaines étapes</h3>
                        <p>Je reviendrai vers vous dans les <strong>24-48h</strong> pour étudier votre demande en détail.</p>
                        <p>Pour une réponse plus rapide, n'hésitez pas à me contacter directement sur WhatsApp :</p>
                        <p style="text-align: center; margin: 20px 0;">
                            <a href="https://wa.me/33782721406" 
                               style="background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                💬 Discuter sur WhatsApp
                            </a>
                        </p>
                    </div>
                    
                    <div style="background: #fff; padding: 20px; border-left: 4px solid #007cba; margin: 20px 0;">
                        <h3 style="color: #555; margin-top: 0;">🚀 En attendant</h3>
                        <p>N'hésitez pas à :</p>
                        <ul>
                            <li>Consulter mes réalisations sur <a href="https://github.com/aissablk1" style="color: #007cba;">GitHub</a></li>
                            <li>Suivre mon actualité sur <a href="https://t.me/investwithaissa" style="color: #007cba;">Telegram</a></li>
                            <li>Me retrouver sur <a href="https://linkedin.com/in/aissabelkoussa" style="color: #007cba;">LinkedIn</a></li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; text-align: center;">
                        <p>À très bientôt,<br><strong>Aïssa BELKOUSSA</strong></p>
                        <p style="font-style: italic; font-size: 14px;">Entrepreneur • Développeur • Créateur</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
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
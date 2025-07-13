import requests
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.telegram_bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')
        self.whatsapp_api_token = os.getenv('WHATSAPP_API_TOKEN')
        self.whatsapp_phone_id = os.getenv('WHATSAPP_PHONE_ID')
    
    def send_telegram_notification(self, submission_data: dict) -> bool:
        """Send notification via Telegram Bot"""
        try:
            if not self.telegram_bot_token or not self.telegram_chat_id:
                logger.warning("Telegram configuration missing. Skipping notification.")
                return False
            
            message = f"""
🔔 *Nouveau contact portfolio*

👤 *Nom:* {submission_data['name']}
📧 *Email:* {submission_data['email']}
📝 *Sujet:* {submission_data['subject']}

💬 *Message:*
{submission_data['message']}

⏰ *Reçu le:* {datetime.now().strftime('%d/%m/%Y à %H:%M')}

🚀 *Actions rapides:*
• [Répondre par email](mailto:{submission_data['email']})
• [WhatsApp](https://wa.me/33782721406)
            """
            
            url = f"https://api.telegram.org/bot{self.telegram_bot_token}/sendMessage"
            payload = {
                'chat_id': self.telegram_chat_id,
                'text': message,
                'parse_mode': 'Markdown',
                'disable_web_page_preview': True
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info("Telegram notification sent successfully")
                return True
            else:
                logger.error(f"Failed to send Telegram notification: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending Telegram notification: {str(e)}")
            return False
    
    def send_whatsapp_notification(self, submission_data: dict) -> bool:
        """Send notification via WhatsApp Business API"""
        try:
            if not self.whatsapp_api_token or not self.whatsapp_phone_id:
                logger.warning("WhatsApp configuration missing. Skipping notification.")
                return False
            
            message = f"""🔔 Nouveau contact portfolio

👤 Nom: {submission_data['name']}
📧 Email: {submission_data['email']}
📝 Sujet: {submission_data['subject']}

💬 Message:
{submission_data['message']}

⏰ Reçu le: {datetime.now().strftime('%d/%m/%Y à %H:%M')}"""
            
            url = f"https://graph.facebook.com/v17.0/{self.whatsapp_phone_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.whatsapp_api_token}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'messaging_product': 'whatsapp',
                'to': '33782721406',  # Your WhatsApp number
                'type': 'text',
                'text': {
                    'body': message
                }
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                logger.info("WhatsApp notification sent successfully")
                return True
            else:
                logger.error(f"Failed to send WhatsApp notification: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp notification: {str(e)}")
            return False
    
    def send_notifications(self, submission_data: dict) -> dict:
        """Send notifications via available channels"""
        results = {
            'telegram': False,
            'whatsapp': False
        }
        
        # Try Telegram notification
        results['telegram'] = self.send_telegram_notification(submission_data)
        
        # Try WhatsApp notification (optional, requires business API)
        results['whatsapp'] = self.send_whatsapp_notification(submission_data)
        
        return results
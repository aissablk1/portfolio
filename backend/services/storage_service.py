import os
import requests
import logging
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.notion_token = os.getenv('NOTION_TOKEN')
        self.notion_database_id = os.getenv('NOTION_DATABASE_ID')
        self.google_sheets_url = os.getenv('GOOGLE_SHEETS_WEBHOOK_URL')
    
    def save_to_notion(self, submission_data: dict) -> bool:
        """Save submission to Notion database"""
        try:
            if not self.notion_token or not self.notion_database_id:
                logger.warning("Notion configuration missing. Skipping save.")
                return False
            
            url = "https://api.notion.com/v1/pages"
            headers = {
                'Authorization': f'Bearer {self.notion_token}',
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
            
            payload = {
                'parent': {'database_id': self.notion_database_id},
                'properties': {
                    'Nom': {
                        'title': [{'text': {'content': submission_data['name']}}]
                    },
                    'Email': {
                        'email': submission_data['email']
                    },
                    'Sujet': {
                        'rich_text': [{'text': {'content': submission_data['subject']}}]
                    },
                    'Message': {
                        'rich_text': [{'text': {'content': submission_data['message']}}]
                    },
                    'Date': {
                        'date': {'start': datetime.now().isoformat()}
                    },
                    'Statut': {
                        'select': {'name': 'Nouveau'}
                    },
                    'IP': {
                        'rich_text': [{'text': {'content': submission_data.get('ip_address', 'N/A')}}]
                    }
                }
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                logger.info("Submission saved to Notion successfully")
                return True
            else:
                logger.error(f"Failed to save to Notion: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error saving to Notion: {str(e)}")
            return False
    
    def save_to_google_sheets(self, submission_data: dict) -> bool:
        """Save submission to Google Sheets via webhook"""
        try:
            if not self.google_sheets_url:
                logger.warning("Google Sheets webhook URL not configured. Skipping save.")
                return False
            
            payload = {
                'timestamp': datetime.now().isoformat(),
                'name': submission_data['name'],
                'email': submission_data['email'],
                'subject': submission_data['subject'],
                'message': submission_data['message'],
                'ip_address': submission_data.get('ip_address', 'N/A'),
                'status': 'nouveau'
            }
            
            response = requests.post(self.google_sheets_url, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info("Submission saved to Google Sheets successfully")
                return True
            else:
                logger.error(f"Failed to save to Google Sheets: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error saving to Google Sheets: {str(e)}")
            return False
    
    def save_submission(self, submission_data: dict) -> dict:
        """Save submission to available storage services"""
        results = {
            'notion': False,
            'google_sheets': False
        }
        
        # Try saving to Notion
        results['notion'] = self.save_to_notion(submission_data)
        
        # Try saving to Google Sheets
        results['google_sheets'] = self.save_to_google_sheets(submission_data)
        
        return results
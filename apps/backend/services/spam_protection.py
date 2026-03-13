import re
from datetime import datetime, timedelta
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class SpamProtection:
    def __init__(self):
        # Rate limiting - track submissions by IP
        self.submission_tracker: Dict[str, List[datetime]] = {}
        
        # Spam keywords to check
        self.spam_keywords = [
            'casino', 'gambling', 'loan', 'credit', 'viagra', 'pharmacy',
            'crypto', 'bitcoin', 'investment opportunity', 'guaranteed profit',
            'click here', 'act now', 'limited time', 'special offer',
            'make money fast', 'work from home', 'business opportunity'
        ]
        
        # Suspicious patterns
        self.suspicious_patterns = [
            r'https?://[^\s]+',  # URLs
            r'\b[A-Z]{3,}\b',     # All caps words
            r'[$€£¥]\d+',        # Money amounts
            r'\d{10,}',          # Long numbers
        ]
    
    def check_rate_limit(self, ip_address: str, max_submissions: int = 3, time_window: int = 3600) -> bool:
        """Check if IP has exceeded rate limit"""
        try:
            current_time = datetime.utcnow()
            cutoff_time = current_time - timedelta(seconds=time_window)
            
            # Initialize tracking for new IP
            if ip_address not in self.submission_tracker:
                self.submission_tracker[ip_address] = []
            
            # Remove old submissions outside time window
            self.submission_tracker[ip_address] = [
                timestamp for timestamp in self.submission_tracker[ip_address] 
                if timestamp > cutoff_time
            ]
            
            # Check if under limit
            if len(self.submission_tracker[ip_address]) >= max_submissions:
                logger.warning(f"Rate limit exceeded for IP: {ip_address}")
                return False
            
            # Add current submission
            self.submission_tracker[ip_address].append(current_time)
            return True
            
        except Exception as e:
            logger.error(f"Error checking rate limit: {str(e)}")
            return True  # Allow submission on error
    
    def calculate_spam_score(self, name: str, email: str, subject: str, message: str) -> float:
        """Calculate spam score (0-1, higher = more likely spam)"""
        score = 0.0
        reasons = []
        
        try:
            # Check for spam keywords
            full_text = f"{name} {subject} {message}".lower()
            spam_word_count = sum(1 for keyword in self.spam_keywords if keyword in full_text)
            if spam_word_count > 0:
                score += min(0.3, spam_word_count * 0.1)
                reasons.append(f"Contains {spam_word_count} spam keywords")
            
            # Check for suspicious patterns
            pattern_count = 0
            for pattern in self.suspicious_patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    pattern_count += 1
            
            if pattern_count > 0:
                score += min(0.2, pattern_count * 0.1)
                reasons.append(f"Contains {pattern_count} suspicious patterns")
            
            # Check message quality
            if len(message.split()) < 5:
                score += 0.2
                reasons.append("Message too short")
            
            if message.isupper():
                score += 0.3
                reasons.append("Message in all caps")
            
            # Check for repetitive content
            words = message.lower().split()
            if len(set(words)) < len(words) * 0.5:
                score += 0.2
                reasons.append("Repetitive content")
            
            # Check email domain
            email_domain = email.split('@')[1].lower()
            suspicious_domains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com']
            if email_domain in suspicious_domains:
                score += 0.4
                reasons.append("Suspicious email domain")
            
            # Check name validity
            if not re.match(r'^[a-zA-ZÀ-ÿ\s\-\'\.]{2,50}$', name):
                score += 0.2
                reasons.append("Invalid name format")
            
            if reasons:
                logger.info(f"Spam check reasons: {', '.join(reasons)}")
            
            return min(1.0, score)
            
        except Exception as e:
            logger.error(f"Error calculating spam score: {str(e)}")
            return 0.0  # Return safe score on error
    
    def is_spam(self, submission_data: dict, threshold: float = 0.5) -> tuple[bool, float, str]:
        """Determine if submission is spam"""
        try:
            spam_score = self.calculate_spam_score(
                submission_data['name'],
                submission_data['email'],
                submission_data['subject'],
                submission_data['message']
            )
            
            is_spam = spam_score >= threshold
            reason = f"Spam score: {spam_score:.2f} (threshold: {threshold})" if is_spam else None
            
            if is_spam:
                logger.warning(f"Submission marked as spam: {reason}")
            
            return is_spam, spam_score, reason
            
        except Exception as e:
            logger.error(f"Error in spam detection: {str(e)}")
            return False, 0.0, None  # Allow submission on error
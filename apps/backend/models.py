from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class ContactFormData(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    cf_turnstile_token: Optional[str] = Field(default=None, max_length=2048)


class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")  # pending, processed, spam
    # Lead scoring (enriched by frontend dual-send)
    lead_score: Optional[int] = None          # 0-100
    lead_label: Optional[str] = None          # CHAUD, TIEDE, FROID
    plan: Optional[str] = None                # autonome, accelerateur, partenaire
    budget: Optional[str] = None
    niche: Optional[str] = None               # btp, b2b, other
    
class ContactResponse(BaseModel):
    success: bool
    message: str
    submission_id: Optional[str] = None

class SpamCheck(BaseModel):
    submission_id: str
    is_spam: bool
    spam_score: float
    reason: Optional[str] = None
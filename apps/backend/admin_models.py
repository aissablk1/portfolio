"""
Modèles Pydantic pour l'API d'administration du portfolio.
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime
from enum import Enum


# ─── Enums ────────────────────────────────────────────────────────────────────

class ContactStatus(str, Enum):
    pending = "pending"
    processed = "processed"
    replied = "replied"
    spam = "spam"
    archived = "archived"
    error = "error"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class ExportFormat(str, Enum):
    csv = "csv"
    json = "json"


# ─── Auth Models ──────────────────────────────────────────────────────────────

class AdminLogin(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=4, max_length=128)


class AdminUser(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    last_login: Optional[datetime] = None
    is_active: bool = True


class AdminUserInDB(AdminUser):
    hashed_password: str


class TokenData(BaseModel):
    sub: str
    username: str
    type: str = "access"
    exp: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUser


# ─── Contact Models ──────────────────────────────────────────────────────────

class ContactUpdate(BaseModel):
    status: Optional[ContactStatus] = None
    notes: Optional[str] = Field(None, max_length=2000)


class ContactReply(BaseModel):
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=5, max_length=5000)


# ─── Email Models ─────────────────────────────────────────────────────────────

class EmailCompose(BaseModel):
    to: EmailStr
    subject: str = Field(..., min_length=2, max_length=200)
    body: str = Field(..., min_length=5, max_length=10000)
    reply_to_contact_id: Optional[str] = None


# ─── Security Models ─────────────────────────────────────────────────────────

class BlacklistCreate(BaseModel):
    value: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., pattern=r"^(ip|domain|email)$")
    reason: Optional[str] = Field(None, max_length=500)


# ─── Site Control Models ─────────────────────────────────────────────────────

class MaintenanceToggle(BaseModel):
    enabled: bool
    message: Optional[str] = Field(None, max_length=500)
    estimated_end: Optional[datetime] = None


# ─── Settings Models ─────────────────────────────────────────────────────────

class SettingsUpdate(BaseModel):
    smtp_server: Optional[str] = None
    smtp_port: Optional[int] = None
    email_user: Optional[str] = None
    recipient_email: Optional[str] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    spam_threshold: Optional[float] = Field(None, ge=0.0, le=1.0)
    rate_limit_max: Optional[int] = Field(None, ge=1, le=100)
    rate_limit_window: Optional[int] = Field(None, ge=60, le=86400)
    maintenance_mode: Optional[bool] = None


# ─── Notification Models ─────────────────────────────────────────────────────

class TestNotification(BaseModel):
    channel: str = Field(..., pattern=r"^(telegram|email|whatsapp|notion|google_sheets)$")
    message: Optional[str] = Field(None, max_length=1000)


# ─── Pipeline Models ─────────────────────────────────────────────────────────

class PipelineStage(str, Enum):
    lead = "lead"              # Nouveau contact / diagnostic
    contacted = "contacted"    # DM ou email envoyé
    call = "call"              # Appel de qualification fait
    proposal = "proposal"      # Devis envoyé
    signed = "signed"          # Acompte encaissé
    delivered = "delivered"    # Projet livré
    lost = "lost"              # Perdu / abandonné


class LeadTemperature(str, Enum):
    hot = "hot"       # CHAUD — score >= 55
    warm = "warm"     # TIEDE — score 30-54
    cold = "cold"     # FROID — score < 30


class PipelineDealCreate(BaseModel):
    contact_id: Optional[str] = None
    name: str = Field(..., min_length=2, max_length=200)
    email: Optional[EmailStr] = None
    company: Optional[str] = Field(None, max_length=200)
    niche: Optional[str] = Field(None, pattern=r"^(btp|b2b|other)$")
    stage: PipelineStage = PipelineStage.lead
    value: Optional[float] = Field(None, ge=0)
    plan: Optional[str] = Field(None, pattern=r"^(autonome|accelerateur|partenaire)$")
    source: Optional[str] = Field(None, max_length=100)  # linkedin, website, diagnostic, referral
    notes: Optional[str] = Field(None, max_length=2000)


class PipelineDealUpdate(BaseModel):
    stage: Optional[PipelineStage] = None
    value: Optional[float] = Field(None, ge=0)
    plan: Optional[str] = None
    niche: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=2000)
    next_action: Optional[str] = Field(None, max_length=500)
    next_action_date: Optional[datetime] = None


# ─── Generic Response Models ─────────────────────────────────────────────────

class PaginatedMeta(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int


class PaginatedResponse(BaseModel):
    success: bool = True
    data: Dict[str, Any]


class ApiResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    error: Optional[str] = None

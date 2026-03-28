// ─── Auth ────────────────────────────────────────────
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

// ─── Contacts ────────────────────────────────────────
export type ContactStatus = "pending" | "processed" | "spam" | "error" | "archived";

export interface Contact {
  id: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
  status: ContactStatus;
  email_sent?: boolean;
  auto_reply_sent?: boolean;
  notifications?: Record<string, unknown>;
  storage?: Record<string, unknown>;
  processed_at?: string;
  error_message?: string;
  notes?: string;
  replied?: boolean;
  replied_at?: string;
}

export interface ContactsListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ContactFilters {
  status?: ContactStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── Emails ──────────────────────────────────────────
export type EmailStatus = "sent" | "delivered" | "failed" | "bounced";
export type EmailType = "notification" | "auto_reply" | "manual_reply";

export interface Email {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  type: EmailType;
  status: EmailStatus;
  contact_id?: string;
  sent_at: string;
  error?: string;
}

export interface EmailCompose {
  to: string;
  subject: string;
  body: string;
}

// ─── Analytics ───────────────────────────────────────
export interface AnalyticsOverview {
  total_contacts: number;
  contacts_today: number;
  contacts_this_week: number;
  contacts_this_month: number;
  spam_blocked: number;
  response_rate: number;
  avg_response_time: number;
  email_delivery_rate: number;
}

export interface TimelinePoint {
  date: string;
  count: number;
  spam: number;
}

export interface SubjectDistribution {
  subject: string;
  count: number;
  percentage: number;
}

export interface GeoData {
  country: string;
  city?: string;
  count: number;
}

export interface HourlyDistribution {
  hour: number;
  count: number;
}

// ─── Security ────────────────────────────────────────
export interface SpamLogEntry {
  id: string;
  email: string;
  ip_address: string;
  reason: string;
  score: number;
  timestamp: string;
  keywords_found?: string[];
}

export interface RateLimitEntry {
  ip_address: string;
  requests: number;
  first_request: string;
  last_request: string;
  blocked: boolean;
}

export interface BlacklistEntry {
  id: string;
  ip_address?: string;
  email_domain?: string;
  reason: string;
  added_at: string;
  added_by: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

// ─── Notifications ───────────────────────────────────
export type NotificationChannel = "telegram" | "whatsapp" | "email" | "notion" | "google_sheets";
export type NotificationStatus = "success" | "failed" | "pending";

export interface NotificationLog {
  id: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  contact_id: string;
  contact_name: string;
  message_preview: string;
  sent_at: string;
  error?: string;
}

// ─── Site Control ────────────────────────────────────
export interface SiteStatus {
  maintenance_enabled: boolean;
  maintenance_password: string;
  maintenance_message?: string;
  domains: DomainStatus[];
  uptime: number;
  last_deploy?: string;
}

export interface DomainStatus {
  domain: string;
  ssl_valid: boolean;
  ssl_expires?: string;
  dns_configured: boolean;
}

// ─── Settings ────────────────────────────────────────
export interface AppSettings {
  email: {
    provider: string;
    smtp_server: string;
    smtp_port: number;
    from_email: string;
    auto_reply_enabled: boolean;
  };
  notifications: {
    telegram_enabled: boolean;
    whatsapp_enabled: boolean;
    notion_enabled: boolean;
    google_sheets_enabled: boolean;
  };
  security: {
    rate_limit_per_hour: number;
    spam_threshold: number;
    auto_blacklist: boolean;
  };
}

// ─── Service Health ──────────────────────────────────
export interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency?: number;
  last_checked: string;
  details?: string;
}

// ─── API Response Wrapper ────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Dashboard Overview ──────────────────────────────
export interface DashboardOverview {
  stats: AnalyticsOverview;
  recent_contacts: Contact[];
  service_health: ServiceHealth[];
  timeline: TimelinePoint[];
  notifications_today: number;
  spam_today: number;
}

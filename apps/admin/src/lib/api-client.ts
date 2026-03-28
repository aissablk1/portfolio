import type { ApiResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token expired — try refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const retryResponse = await fetch(url, config);
        if (!retryResponse.ok) {
          throw new ApiError(retryResponse.status, "Request failed after token refresh");
        }
        return retryResponse.json();
      }
      // Refresh failed — redirect to login (only if not already there)
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      throw new ApiError(401, "Session expirée");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Erreur inconnue" }));
      throw new ApiError(response.status, error.detail ?? error.message ?? "Erreur serveur");
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/refresh`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // ─── Auth ───────────────────────────────────────
  async login(username: string, password: string) {
    return this.request<ApiResponse<{ user: { id: string; username: string; email: string } }>>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request<ApiResponse<null>>("/api/admin/logout", {
      method: "POST",
    });
  }

  async getMe() {
    return this.request<ApiResponse<{ user: { id: string; username: string; email: string; last_login: string } }>>("/api/admin/me");
  }

  // ─── Dashboard ──────────────────────────────────
  async getDashboard() {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/dashboard");
  }

  // ─── Contacts ───────────────────────────────────
  async getContacts(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ApiResponse<{ contacts: Record<string, unknown>[]; total: number; page: number; per_page: number; total_pages: number }>>(`/api/admin/contacts${query ? `?${query}` : ""}`);
  }

  async getContact(id: string) {
    return this.request<ApiResponse<Record<string, unknown>>>(`/api/admin/contacts/${id}`);
  }

  async updateContact(id: string, data: Record<string, unknown>) {
    return this.request<ApiResponse<Record<string, unknown>>>(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string) {
    return this.request<ApiResponse<null>>(`/api/admin/contacts/${id}`, {
      method: "DELETE",
    });
  }

  async replyToContact(id: string, message: string) {
    return this.request<ApiResponse<Record<string, unknown>>>(`/api/admin/contacts/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async exportContacts(format: "csv" | "json") {
    return this.request<Blob>(`/api/admin/contacts/export?format=${format}`);
  }

  // ─── Emails ─────────────────────────────────────
  async getEmails(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ApiResponse<{ emails: Record<string, unknown>[]; total: number }>>(`/api/admin/emails${query ? `?${query}` : ""}`);
  }

  async sendEmail(data: { to: string; subject: string; body: string }) {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/emails/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ─── Analytics ──────────────────────────────────
  async getAnalyticsOverview(period?: string) {
    return this.request<ApiResponse<Record<string, unknown>>>(`/api/admin/analytics/overview${period ? `?period=${period}` : ""}`);
  }

  async getAnalyticsTimeline(days?: number) {
    return this.request<ApiResponse<{ timeline: Record<string, unknown>[] }>>(`/api/admin/analytics/timeline${days ? `?days=${days}` : ""}`);
  }

  async getAnalyticsGeo() {
    return this.request<ApiResponse<{ geo: Record<string, unknown>[] }>>("/api/admin/analytics/geo");
  }

  async getAnalyticsSubjects() {
    return this.request<ApiResponse<{ subjects: Record<string, unknown>[] }>>("/api/admin/analytics/subjects");
  }

  // ─── Security ───────────────────────────────────
  async getSpamLog(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ApiResponse<{ logs: Record<string, unknown>[]; total: number }>>(`/api/admin/security/spam-log${query ? `?${query}` : ""}`);
  }

  async getRateLimits() {
    return this.request<ApiResponse<{ limits: Record<string, unknown>[] }>>("/api/admin/security/rate-limits");
  }

  async getBlacklist() {
    return this.request<ApiResponse<{ entries: Record<string, unknown>[] }>>("/api/admin/security/blacklist");
  }

  async addToBlacklist(data: { ip_address?: string; email_domain?: string; reason: string }) {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/security/blacklist", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async removeFromBlacklist(id: string) {
    return this.request<ApiResponse<null>>(`/api/admin/security/blacklist/${id}`, {
      method: "DELETE",
    });
  }

  async getAuditLog(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ApiResponse<{ logs: Record<string, unknown>[]; total: number }>>(`/api/admin/security/audit-log${query ? `?${query}` : ""}`);
  }

  // ─── Notifications ─────────────────────────────
  async getNotificationLogs(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString();
    return this.request<ApiResponse<{ logs: Record<string, unknown>[]; total: number }>>(`/api/admin/notifications/logs${query ? `?${query}` : ""}`);
  }

  async testNotification(channel: string) {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/notifications/test", {
      method: "POST",
      body: JSON.stringify({ channel }),
    });
  }

  // ─── Site Control ──────────────────────────────
  async getSiteStatus() {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/site/status");
  }

  async toggleMaintenance(enabled: boolean, password?: string, message?: string) {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/site/maintenance", {
      method: "POST",
      body: JSON.stringify({ enabled, password, message }),
    });
  }

  async getSiteHealth() {
    return this.request<ApiResponse<{ services: Record<string, unknown>[] }>>("/api/admin/site/health");
  }

  // ─── Settings ──────────────────────────────────
  async getSettings() {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/settings");
  }

  async updateSettings(data: Record<string, unknown>) {
    return this.request<ApiResponse<Record<string, unknown>>>("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async triggerBackup() {
    return this.request<ApiResponse<{ backup_id: string; download_url: string }>>("/api/admin/settings/backup", {
      method: "POST",
    });
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const api = new ApiClient(API_BASE);

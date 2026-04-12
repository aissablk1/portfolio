import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour}h`;
  if (diffDay < 7) return `Il y a ${diffDay}j`;
  return formatDate(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]",
    processed: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    spam: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
    error: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
    archived: "text-[var(--color-text-tertiary)] bg-[var(--color-bg-hover)]",
    sent: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    delivered: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    failed: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
    bounced: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]",
    healthy: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    degraded: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]",
    down: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
    success: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    active: "text-[var(--color-success)] bg-[var(--color-success-soft)]",
    completed: "text-[var(--color-info)] bg-[var(--color-info-soft)]",
    cancelled: "text-[var(--color-error)] bg-[var(--color-error-soft)]",
    paused: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]",
  };
  return colors[status] ?? "text-[var(--color-text-secondary)] bg-[var(--color-bg-hover)]";
}

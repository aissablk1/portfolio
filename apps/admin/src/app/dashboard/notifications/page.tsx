"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { getStatusColor } from "@/lib/utils";
import type { NotificationLog, NotificationChannel, NotificationStatus } from "@/lib/types";
import {
  Bell,
  Send,
  MessageCircle,
  Mail,
  BookOpen,
  Table2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

// ─── Channel config ──────────────────────────────────
interface ChannelConfig {
  key: NotificationChannel;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const channels: ChannelConfig[] = [
  {
    key: "telegram",
    label: "Telegram",
    icon: Send,
    color: "text-[#26A5E4]",
    bgColor: "bg-[#26A5E4]/15",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-[#25D366]",
    bgColor: "bg-[#25D366]/15",
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    color: "text-[var(--color-accent)]",
    bgColor: "bg-[var(--color-accent-soft)]",
  },
  {
    key: "notion",
    label: "Notion",
    icon: BookOpen,
    color: "text-[var(--color-text-primary)]",
    bgColor: "bg-[var(--color-bg-hover)]",
  },
  {
    key: "google_sheets",
    label: "Google Sheets",
    icon: Table2,
    color: "text-[#34A853]",
    bgColor: "bg-[#34A853]/15",
  },
];

// ─── Status icons ────────────────────────────────────
const statusIcons: Record<NotificationStatus, React.ElementType> = {
  success: CheckCircle2,
  failed: XCircle,
  pending: Clock,
};

function getChannelConfig(key: NotificationChannel): ChannelConfig {
  return channels.find((c) => c.key === key) ?? channels[0];
}

// ─── Main Page ───────────────────────────────────────
export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification logs
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const logsPerPage = 15;

  // Filters
  const [filterChannel, setFilterChannel] = useState<NotificationChannel | "">("");
  const [filterStatus, setFilterStatus] = useState<NotificationStatus | "">("");

  // Test notification
  const [testingChannel, setTestingChannel] = useState<NotificationChannel | null>(null);

  // Channel stats (derived from logs)
  const [channelStats, setChannelStats] = useState<
    Record<NotificationChannel, { total: number; success: number; lastSent: string | null; enabled: boolean }>
  >({
    telegram: { total: 0, success: 0, lastSent: null, enabled: false },
    whatsapp: { total: 0, success: 0, lastSent: null, enabled: false },
    email: { total: 0, success: 0, lastSent: null, enabled: false },
    notion: { total: 0, success: 0, lastSent: null, enabled: false },
    google_sheets: { total: 0, success: 0, lastSent: null, enabled: false },
  });

  // ─── Load data ──────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page: logsPage,
        per_page: logsPerPage,
      };
      if (filterChannel) params.channel = filterChannel;
      if (filterStatus) params.status = filterStatus;

      const [logsRes, settingsRes] = await Promise.all([
        api.getNotificationLogs(params),
        api.getSettings(),
      ]);

      if (logsRes.data) {
        const logsData = logsRes.data as Record<string, unknown>;
        const rawLogs = logsData.logs;
        const fetchedLogs = Array.isArray(rawLogs) ? rawLogs as unknown as NotificationLog[] : [];
        setLogs(fetchedLogs);
        setLogsTotal(typeof logsData.total === "number" ? logsData.total : 0);

        // Derive channel stats from all logs
        const stats: Record<NotificationChannel, { total: number; success: number; lastSent: string | null; enabled: boolean }> = {
          telegram: { total: 0, success: 0, lastSent: null, enabled: false },
          whatsapp: { total: 0, success: 0, lastSent: null, enabled: false },
          email: { total: 0, success: 0, lastSent: null, enabled: false },
          notion: { total: 0, success: 0, lastSent: null, enabled: false },
          google_sheets: { total: 0, success: 0, lastSent: null, enabled: false },
        };

        fetchedLogs.forEach((log) => {
          const ch = stats[log.channel];
          if (ch) {
            ch.total++;
            if (log.status === "success") ch.success++;
            if (!ch.lastSent || log.sent_at > ch.lastSent) ch.lastSent = log.sent_at;
          }
        });

        // Apply enabled status from settings
        if (settingsRes.data) {
          const settingsData = settingsRes.data as Record<string, unknown>;
          const notif = settingsData.notifications as Record<string, boolean> | undefined;
          if (notif && typeof notif === "object") {
            stats.telegram.enabled = !!notif.telegram_enabled;
            stats.whatsapp.enabled = !!notif.whatsapp_enabled;
            stats.email.enabled = true; // Email always enabled
            stats.notion.enabled = !!notif.notion_enabled;
            stats.google_sheets.enabled = !!notif.google_sheets_enabled;
          }
        }

        setChannelStats(stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [logsPage, filterChannel, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Test notification ──────────────────────────
  const handleTest = async (channel: NotificationChannel) => {
    setTestingChannel(channel);
    try {
      const res = await api.testNotification(channel);
      if (res.success) {
        toast.success(`Notification de test envoyee via ${getChannelConfig(channel).label}`);
      } else {
        toast.error(`Echec de l'envoi via ${getChannelConfig(channel).label}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du test");
    } finally {
      setTestingChannel(null);
    }
  };

  // ─── Loading state ──────────────────────────────
  if (loading && logs.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (error && logs.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
        <p className="text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={loadData}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Reessayer
        </button>
      </div>
    );
  }

  const logsTotalPages = Math.ceil(logsTotal / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Canaux de notification, logs de livraison et tests
        </p>
      </motion.div>

      {/* Channel Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {channels.map((ch, i) => {
          const stats = channelStats[ch.key];
          const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
          const Icon = ch.icon;

          return (
            <motion.div
              key={ch.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "rounded-[var(--radius-lg)] border p-4 backdrop-blur-xl transition-colors",
                stats.enabled
                  ? "border-[var(--color-success)]/30 bg-[var(--color-glass)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]", ch.bgColor)}>
                  <Icon className={cn("h-4.5 w-4.5", ch.color)} />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    stats.enabled
                      ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                      : "bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
                  )}
                >
                  {stats.enabled ? "Actif" : "Inactif"}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                {ch.label}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--color-text-tertiary)]">Taux de succes</span>
                  <span className="font-medium text-[var(--color-text-secondary)]">
                    {stats.total > 0 ? `${successRate}%` : "—"}
                  </span>
                </div>
                {stats.lastSent && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-text-tertiary)]">Dernier envoi</span>
                    <span className="text-[var(--color-text-secondary)]">
                      {formatRelativeTime(stats.lastSent)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Test Notification Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-[var(--color-warning)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Tester les notifications
          </h2>
        </div>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Envoyez une notification de test a chaque canal pour verifier la configuration.
        </p>
        <div className="flex flex-wrap gap-3">
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isTesting = testingChannel === ch.key;
            return (
              <button
                key={ch.key}
                onClick={() => handleTest(ch.key)}
                disabled={isTesting || testingChannel !== null}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors",
                  "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]",
                  "hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
                )}
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className={cn("h-4 w-4", ch.color)} />
                )}
                {ch.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Delivery Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[var(--color-text-tertiary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Statistiques de livraison
          </h2>
        </div>
        <div className="space-y-4">
          {channels.map((ch) => {
            const stats = channelStats[ch.key];
            const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
            const Icon = ch.icon;
            return (
              <div key={ch.key} className="flex items-center gap-4">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]", ch.bgColor)}>
                  <Icon className={cn("h-4 w-4", ch.color)} />
                </div>
                <span className="w-28 shrink-0 text-sm text-[var(--color-text-primary)]">
                  {ch.label}
                </span>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-[var(--color-bg-hover)]">
                    <motion.div
                      className={cn(
                        "h-2 rounded-full",
                        successRate >= 90
                          ? "bg-[var(--color-success)]"
                          : successRate >= 50
                            ? "bg-[var(--color-warning)]"
                            : stats.total === 0
                              ? "bg-[var(--color-bg-active)]"
                              : "bg-[var(--color-error)]"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.total > 0 ? successRate : 0}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                  {stats.total > 0 ? `${successRate}%` : "—"}
                </span>
                <span className="w-12 text-right text-xs text-[var(--color-text-tertiary)]">
                  {stats.total}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Notification Log */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Journal des notifications
            </h2>
          </div>
          <div className="flex gap-2">
            {/* Channel filter */}
            <select
              value={filterChannel}
              onChange={(e) => {
                setFilterChannel(e.target.value as NotificationChannel | "");
                setLogsPage(1);
              }}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none"
            >
              <option value="">Tous les canaux</option>
              {channels.map((ch) => (
                <option key={ch.key} value={ch.key}>
                  {ch.label}
                </option>
              ))}
            </select>
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as NotificationStatus | "");
                setLogsPage(1);
              }}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none"
            >
              <option value="">Tous les statuts</option>
              <option value="success">Succes</option>
              <option value="failed">Echoue</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        {logs.length > 0 ? (
          <>
            <div className="space-y-2">
              {logs.map((log) => {
                const chConfig = getChannelConfig(log.channel);
                const ChannelIcon = chConfig.icon;
                const StatusIcon = statusIcons[log.status];

                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-3"
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]", chConfig.bgColor)}>
                      <ChannelIcon className={cn("h-4 w-4", chConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {log.contact_name}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", getStatusColor(log.status))}>
                          <StatusIcon className="h-3 w-3" />
                          {log.status === "success" ? "Envoye" : log.status === "failed" ? "Echoue" : "En attente"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)] truncate">
                        {truncate(log.message_preview, 80)}
                      </p>
                      {log.error && (
                        <p className="mt-0.5 text-xs text-[var(--color-error)]">
                          {log.error}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-[var(--color-text-tertiary)] whitespace-nowrap">
                      {formatRelativeTime(log.sent_at)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {logsTotalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Page {logsPage} sur {logsTotalPages} ({logsTotal} resultats)
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                    disabled={logsPage <= 1}
                    className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setLogsPage((p) => Math.min(logsTotalPages, p + 1))}
                    disabled={logsPage >= logsTotalPages}
                    className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucune notification enregistree
          </div>
        )}
      </motion.div>
    </div>
  );
}

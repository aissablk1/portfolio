"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Clock,
  TrendingUp,
  Database,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Bell as BellIcon,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api-client";
import { cn, formatRelativeTime, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading";
import type {
  DashboardOverview,
  Contact,
  ServiceHealth,
  TimelinePoint,
} from "@/lib/types";

// ─── Animation variants ──────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Skeleton Loader ─────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-hover)]",
        className
      )}
    />
  );
}

// ─── Activity Item ───────────────────────────────────────
function ActivityItem({ contact }: { contact: Contact }) {
  const statusDot: Record<string, string> = {
    processed: "bg-[var(--color-success)]",
    pending: "bg-[var(--color-warning)]",
    spam: "bg-[var(--color-error)]",
    error: "bg-[var(--color-error)]",
    archived: "bg-[var(--color-text-muted)]",
  };

  const description =
    contact.status === "spam"
      ? `Spam bloqué : ${contact.name}`
      : contact.replied
        ? `Email envoyé à ${contact.name}`
        : `Nouveau contact : ${contact.name}`;

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-3 py-3 border-b border-[var(--color-border)] last:border-0"
    >
      <div className="relative mt-1.5">
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            statusDot[contact.status] ?? "bg-[var(--color-text-muted)]"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-text-primary)] truncate">
          {description}
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
          {contact.subject}
        </p>
      </div>
      <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
        {formatRelativeTime(contact.timestamp)}
      </span>
    </motion.div>
  );
}

// ─── Service Health Card ─────────────────────────────────
function ServiceHealthCard({ service }: { service: ServiceHealth }) {
  const statusDot: Record<string, string> = {
    healthy: "bg-[var(--color-success)]",
    degraded: "bg-[var(--color-warning)]",
    down: "bg-[var(--color-error)]",
  };

  const statusLabel: Record<string, string> = {
    healthy: "Opérationnel",
    degraded: "Dégradé",
    down: "Hors ligne",
  };

  const serviceIcon: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    MongoDB: Database,
    SMTP: Mail,
    Telegram: MessageSquare,
    WhatsApp: MessageSquare,
    Notion: FileSpreadsheet,
    "Google Sheets": FileSpreadsheet,
  };

  const Icon = serviceIcon[service.name] ?? Activity;

  return (
    <motion.div
      variants={itemVariants}
      className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg-hover)]">
        <Icon className="h-4 w-4 text-[var(--color-text-secondary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {service.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {formatRelativeTime(service.last_checked)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {statusLabel[service.status]}
        </span>
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            statusDot[service.status] ?? "bg-[var(--color-text-muted)]"
          )}
        />
      </div>
    </motion.div>
  );
}

// ─── Chart Tooltip ───────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-3 py-2 shadow-lg">
      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {entry.dataKey === "count" ? "Contacts" : "Spam"} : {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDashboard();
      if (response.success && response.data) {
        setData(response.data as unknown as DashboardOverview);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le tableau de bord"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Format timeline data for chart
  const chartData = (data?.timeline ?? []).map((point: TimelinePoint) => ({
    date: formatDate(point.date, { day: "numeric", month: "short" }),
    count: point.count,
    spam: point.spam,
  }));

  // Calculate trends
  const contactsTrend =
    data?.stats
      ? {
          value:
            data.stats.contacts_this_month > 0
              ? Math.round(
                  ((data.stats.contacts_this_month -
                    data.stats.contacts_this_week * 4) /
                    Math.max(data.stats.contacts_this_week * 4, 1)) *
                    100
                )
              : 0,
          label: "vs mois dernier",
        }
      : undefined;

  if (error) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Erreur de chargement"
        description={error}
        action={{ label: "Réessayer", onClick: fetchDashboard }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Tableau de bord
          </h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
            Vue d&apos;ensemble de l&apos;activité
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Contacts ce mois"
            value={data?.stats.contacts_this_month ?? 0}
            trend={contactsTrend}
            index={0}
          />
          <StatCard
            icon={UserPlus}
            label="Nouveaux aujourd'hui"
            value={data?.stats.contacts_today ?? 0}
            index={1}
          />
          <StatCard
            icon={ShieldCheck}
            label="Taux de délivrabilité"
            value={`${data?.stats.email_delivery_rate ?? 0}%`}
            trend={
              data?.stats
                ? {
                    value:
                      data.stats.email_delivery_rate >= 95 ? 2 : -3,
                    label: "Objectif : 95%",
                  }
                : undefined
            }
            index={2}
          />
          <StatCard
            icon={ShieldAlert}
            label="Spam bloqué"
            value={data?.stats.spam_blocked ?? 0}
            trend={
              data?.spam_today !== undefined
                ? {
                    value:
                      data.spam_today > 0 ? -data.spam_today : 0,
                    label: `${data.spam_today} aujourd'hui`,
                  }
                : undefined
            }
            index={3}
          />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Chart — 2 cols */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Soumissions — 7 derniers jours
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Contacts reçus et spam bloqué
              </p>
            </div>
            <Activity className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[280px] text-center">
              <Activity className="h-10 w-10 text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Aucune donnée disponible
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="gradientContacts"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradientSpam"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-error)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-error)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#gradientContacts)"
                />
                <Area
                  type="monotone"
                  dataKey="spam"
                  stroke="var(--color-error)"
                  strokeWidth={1.5}
                  fill="url(#gradientSpam)"
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Activity Timeline — 1 col */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Activité récente
            </h2>
            <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-2.5 w-2.5 rounded-full mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (data?.recent_contacts ?? []).length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucune activité"
              description="Aucune activité récente à afficher"
              className="py-8"
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-h-[400px] overflow-y-auto"
            >
              {(data?.recent_contacts ?? []).slice(0, 10).map((contact) => (
                <ActivityItem
                  key={contact.id ?? contact._id}
                  contact={contact}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Health */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              État des services
            </h2>
            <BellIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (data?.service_health ?? []).length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Aucun service"
              description="Aucun service configuré"
              className="py-8"
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {(data?.service_health ?? []).map((service) => (
                <ServiceHealthCard key={service.name} service={service} />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Statistiques rapides
            </h2>
            <TrendingUp className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Response Rate */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-success-soft)]">
                  <ShieldCheck className="h-5 w-5 text-[var(--color-success)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    Taux de réponse
                  </p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {data?.stats.response_rate ?? 0}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-20 h-2 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-success)] transition-all duration-1000"
                      style={{
                        width: `${data?.stats.response_rate ?? 0}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Average Response Time */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-info-soft)]">
                  <Clock className="h-5 w-5 text-[var(--color-info)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    Temps de réponse moyen
                  </p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {data?.stats.avg_response_time
                      ? data.stats.avg_response_time < 60
                        ? `${data.stats.avg_response_time} min`
                        : `${Math.round(data.stats.avg_response_time / 60)}h`
                      : "Non disponible (N/A)"}
                  </p>
                </div>
              </motion.div>

              {/* Weekly comparison */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                  <TrendingUp className="h-5 w-5 text-[var(--color-accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    Cette semaine
                  </p>
                  <p className="text-xl font-bold text-[var(--color-text-primary)]">
                    {data?.stats.contacts_this_week ?? 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Notifications
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {data?.notifications_today ?? 0} aujourd&apos;hui
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

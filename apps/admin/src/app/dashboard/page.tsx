"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Eye,
  GitBranch,
  Star,
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
  ExternalLink,
  Code2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
  GitHubProfile,
  PageViewStats,
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
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
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

  const labels: Record<string, string> = {
    count: "Contacts",
    spam: "Spam",
    views: "Visiteurs",
  };

  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-3 py-2 shadow-lg">
      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {labels[entry.dataKey] ?? entry.dataKey} : {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Language Bar ────────────────────────────────────────
const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  HTML: "#e34c26",
  CSS: "#1572b6",
  Shell: "#89e051",
  Rust: "#dea584",
  Go: "#00add8",
};

// ─── Main Dashboard Page ─────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [github, setGithub] = useState<GitHubProfile | null>(null);
  const [pageviews, setPageviews] = useState<PageViewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashRes, ghRes, pvRes] = await Promise.allSettled([
        api.getDashboard(),
        api.getGitHubProfile(),
        api.getPageViews(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value.data) {
        setData(dashRes.value.data as unknown as DashboardOverview);
      }
      if (ghRes.status === "fulfilled" && ghRes.value.data) {
        setGithub(ghRes.value.data as unknown as GitHubProfile);
      }
      if (pvRes.status === "fulfilled" && pvRes.value.data) {
        setPageviews(pvRes.value.data as unknown as PageViewStats);
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
    fetchAll();
  }, [fetchAll]);

  // Format timeline data for chart
  const chartData = (data?.timeline ?? []).map((point: TimelinePoint) => ({
    date: formatDate(point.date, { day: "numeric", month: "short" }),
    count: point.count,
    spam: point.spam,
  }));

  // Merge pageview timeline into chart if available
  const pvTimeline = (pageviews?.timeline ?? []).reduce<Record<string, number>>(
    (acc, p) => {
      const key = formatDate(p.date, { day: "numeric", month: "short" });
      acc[key] = p.count;
      return acc;
    },
    {}
  );
  const mergedChart = chartData.map((d) => ({
    ...d,
    views: pvTimeline[d.date] ?? 0,
  }));

  // Service count
  const healthyCount = (data?.service_health ?? []).filter(
    (s) => s.status === "healthy"
  ).length;

  if (error && !data) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Erreur de chargement"
        description={error}
        action={{ label: "Réessayer", onClick: fetchAll }}
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
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Actualiser
        </button>
      </div>

      {/* ───── Row 1: KPI Cards (6) ───── */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={Eye}
            label="Visiteurs aujourd'hui"
            value={pageviews?.today ?? 0}
            index={0}
          />
          <StatCard
            icon={Users}
            label="Contacts ce mois"
            value={data?.stats.contacts_this_month ?? 0}
            index={1}
          />
          <StatCard
            icon={GitBranch}
            label="Repos GitHub"
            value={github?.profile.public_repos ?? 0}
            index={2}
          />
          <StatCard
            icon={Star}
            label="Stars GitHub"
            value={github?.total_stars ?? 0}
            index={3}
          />
          <StatCard
            icon={ShieldCheck}
            label="Taux de réponse"
            value={`${data?.stats.response_rate ?? 0}%`}
            index={4}
          />
          <StatCard
            icon={Activity}
            label="Services actifs"
            value={`${healthyCount}/${(data?.service_health ?? []).length}`}
            index={5}
          />
        </div>
      )}

      {/* ───── Row 2: Chart + Activity ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Combined Chart — 2 cols */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Activité — 7 derniers jours
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                Visiteurs, contacts et spam
              </p>
            </div>
            <Activity className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>

          {loading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : mergedChart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[280px] text-center">
              <Activity className="h-10 w-10 text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Aucune donnée disponible
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={mergedChart}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gContacts" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="gSpam" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#gViews)"
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  fill="url(#gContacts)"
                />
                <Area
                  type="monotone"
                  dataKey="spam"
                  stroke="var(--color-error)"
                  strokeWidth={1.5}
                  fill="url(#gSpam)"
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Activity Feed — 1 col */}
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
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-2.5 w-2.5 rounded-full mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (data?.recent_contacts ?? []).length === 0 &&
            (github?.recent_activity ?? []).length === 0 ? (
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
              className="max-h-[380px] overflow-y-auto space-y-0"
            >
              {/* Contacts */}
              {(data?.recent_contacts ?? []).slice(0, 5).map((contact) => (
                <ActivityItem
                  key={contact.id ?? contact._id}
                  contact={contact}
                />
              ))}
              {/* GitHub commits */}
              {(github?.recent_activity ?? []).slice(0, 5).map((act, i) => (
                <motion.div
                  key={`gh-${i}`}
                  variants={itemVariants}
                  className="flex items-start gap-3 py-3 border-b border-[var(--color-border)] last:border-0"
                >
                  <div className="relative mt-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text-primary)] truncate">
                      {act.message}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      {act.repo}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                    {formatRelativeTime(act.created_at)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ───── Row 3: GitHub + Services ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                GitHub
              </h2>
            </div>
            {github?.profile.html_url && (
              <a
                href={github.profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
              >
                @{github.profile.login}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : !github ? (
            <EmptyState
              icon={GitBranch}
              title="GitHub indisponible"
              description="Impossible de charger les données GitHub"
              className="py-8"
            />
          ) : (
            <div className="space-y-4">
              {/* Language distribution */}
              {Object.keys(github.languages).length > 0 && (
                <div>
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-[var(--color-bg-hover)]">
                    {Object.entries(github.languages)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([lang, count]) => {
                        const total = Object.values(github.languages).reduce(
                          (a, b) => a + b,
                          0
                        );
                        return (
                          <div
                            key={lang}
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${(count / total) * 100}%`,
                              backgroundColor:
                                langColors[lang] ?? "var(--color-text-muted)",
                            }}
                            title={`${lang}: ${count} repos`}
                          />
                        );
                      })}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {Object.entries(github.languages)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([lang, count]) => (
                        <div
                          key={lang}
                          className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                langColors[lang] ?? "var(--color-text-muted)",
                            }}
                          />
                          {lang}{" "}
                          <span className="text-[var(--color-text-muted)]">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Top repos */}
              <div className="space-y-2">
                {github.repos.slice(0, 5).map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-hover)] transition-colors group"
                  >
                    <Code2 className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] truncate">
                        {repo.name}
                      </p>
                      {repo.description && (
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                          {repo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {repo.language && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${langColors[repo.language] ?? "#666"}20`,
                            color: langColors[repo.language] ?? "var(--color-text-muted)",
                          }}
                        >
                          {repo.language}
                        </span>
                      )}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-[var(--color-text-muted)]">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

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
              {Array.from({ length: 5 }).map((_, i) => (
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

          {/* Quick stats below services */}
          {!loading && data && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 space-y-3"
            >
              <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-success-soft)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Taux de réponse
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {data.stats.response_rate}%
                  </p>
                </div>
                <div className="w-16 h-2 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-success)] transition-all duration-1000"
                    style={{
                      width: `${data.stats.response_rate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-info-soft)]">
                  <Clock className="h-4 w-4 text-[var(--color-info)]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Temps de réponse moyen
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {data.stats.avg_response_time
                      ? data.stats.avg_response_time < 60
                        ? `${data.stats.avg_response_time} min`
                        : `${Math.round(data.stats.avg_response_time / 60)}h`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                  <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    Cette semaine
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {data.stats.contacts_this_week} contacts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Notifications
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                    {data.notifications_today} aujourd&apos;hui
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ───── Row 4: Top pages ───── */}
      {pageviews && (pageviews.top_pages?.length ?? 0) > 0 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Pages les plus visitées
            </h2>
            <Eye className="h-4 w-4 text-[var(--color-text-muted)]" />
          </div>
          <div className="space-y-2">
            {pageviews.top_pages.slice(0, 8).map((p, i) => {
              const maxCount = pageviews.top_pages[0]?.count ?? 1;
              return (
                <div key={p.page} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-text-muted)] w-5 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--color-text-primary)] truncate">
                        {p.page}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] ml-2">
                        {p.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(p.count / maxCount) * 100}%`,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full bg-[#8b5cf6]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

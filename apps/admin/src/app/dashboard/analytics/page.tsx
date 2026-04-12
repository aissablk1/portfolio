"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type {
  AnalyticsOverview,
  TimelinePoint,
  SubjectDistribution,
  GeoData,
  HourlyDistribution,
  PageViewStats,
} from "@/lib/types";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  MessageSquare,
  Globe,
  Clock,
  Loader2,
  AlertCircle,
  Users,
  Target,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ─── Recharts dark theme ─────────────────────────────
const chartColors = {
  stroke: "#3b82f6",
  fill: "rgba(59, 130, 246, 0.15)",
  grid: "#27272a",
  text: "#a1a1aa",
  tooltipBg: "#18181b",
  tooltipBorder: "#27272a",
  spam: "#ef4444",
  spamFill: "rgba(239, 68, 68, 0.15)",
};

const SUBJECT_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b"];

// ─── Periods ─────────────────────────────────────────
const periods = [
  { key: "7d", label: "7 jours", days: 7 },
  { key: "30d", label: "30 jours", days: 30 },
  { key: "90d", label: "90 jours", days: 90 },
  { key: "12m", label: "12 mois", days: 365 },
] as const;

type PeriodKey = (typeof periods)[number]["key"];

// ─── Custom Tooltip ──────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[var(--radius-md)] border px-3 py-2 text-xs shadow-lg"
      style={{
        background: chartColors.tooltipBg,
        borderColor: chartColors.tooltipBorder,
      }}
    >
      <p className="mb-1 font-medium text-[var(--color-text-primary)]">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)]">
          <Icon className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend >= 0
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]"
            )}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend >= 0 ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--color-text-primary)]">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-[var(--color-text-tertiary)]">
              {suffix}
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────
export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [subjects, setSubjects] = useState<SubjectDistribution[]>([]);
  const [geo, setGeo] = useState<GeoData[]>([]);
  const [hourly, setHourly] = useState<HourlyDistribution[]>([]);
  const [pageviews, setPageviews] = useState<PageViewStats | null>(null);

  const selectedPeriod = periods.find((p) => p.key === period)!;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, timelineRes, subjectsRes, geoRes, pvRes] = await Promise.all([
        api.getAnalyticsOverview(period),
        api.getAnalyticsTimeline(selectedPeriod.days),
        api.getAnalyticsSubjects(),
        api.getAnalyticsGeo(),
        api.getPageViews(),
      ]);

      if (overviewRes.data) {
        setOverview(overviewRes.data as unknown as AnalyticsOverview);
      }

      const timelineData = timelineRes.data as Record<string, unknown> | undefined;
      const rawTimeline = timelineData?.timeline;
      if (Array.isArray(rawTimeline)) {
        setTimeline(rawTimeline as unknown as TimelinePoint[]);
      }

      const subjectsData = subjectsRes.data as Record<string, unknown> | undefined;
      const rawSubjects = subjectsData?.subjects;
      if (Array.isArray(rawSubjects)) {
        setSubjects(
          (rawSubjects as unknown as SubjectDistribution[]).slice(0, 5)
        );
      }

      const geoData = geoRes.data as Record<string, unknown> | undefined;
      const rawGeo = geoData?.geo;
      if (Array.isArray(rawGeo)) {
        setGeo(rawGeo as unknown as GeoData[]);
      }

      if (pvRes.data) {
        setPageviews(pvRes.data as unknown as PageViewStats);
      }

      // Derive hourly from timeline if API returns it, or generate from timeline dates
      if (Array.isArray(rawTimeline) && rawTimeline.length > 0) {
        const tl = rawTimeline as unknown as (TimelinePoint & { hourly?: HourlyDistribution[] })[];
        if ("hourly" in (tl[0] as unknown as Record<string, unknown>)) {
          // API returns hourly data
        } else {
          // Generate hourly distribution from timeline data
          const hourlyMap: Record<number, number> = {};
          for (let h = 0; h < 24; h++) hourlyMap[h] = 0;
          tl.forEach((point) => {
            const d = new Date(point.date);
            const h = d.getHours();
            hourlyMap[h] += point.count;
          });
          setHourly(
            Object.entries(hourlyMap).map(([hour, count]) => ({
              hour: parseInt(hour),
              count,
            }))
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [period, selectedPeriod.days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formattedTimeline = timeline.map((point) => ({
    ...point,
    dateFormatted: formatDate(point.date, { day: "numeric", month: "short" }),
  }));

  const maxHourlyCount = hourly.length > 0 ? Math.max(...hourly.map((h) => h.count), 1) : 1;

  // ─── Loading state ──────────────────────────────
  if (loading && !overview) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  // ─── Error state ────────────────────────────────
  if (error && !overview) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
        <p className="text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={loadData}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Analytiques
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Statistiques et tendances des soumissions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1"
        >
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
                period === p.key
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {p.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Loading overlay during period change */}
      {loading && overview && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Mise à jour...
        </div>
      )}

      {/* ═══ VISITEURS SECTION ═══ */}
      <div className="flex items-center gap-2">
        <Eye className="h-5 w-5 text-violet-500" />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Visiteurs</h2>
      </div>

      {/* Page views stat cards */}
      {pageviews && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard icon={Eye} label="Vues aujourd'hui" value={pageviews.today} delay={0} />
          <KpiCard icon={Eye} label="Cette semaine" value={pageviews.this_week} delay={0.05} />
          <KpiCard icon={Eye} label="Ce mois" value={pageviews.this_month} delay={0.1} />
        </div>
      )}

      {/* Page views timeline chart */}
      {pageviews && pageviews.timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
        >
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
            Visites dans le temps
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={pageviews.timeline.map((p) => ({
                ...p,
                dateFormatted: formatDate(p.date, { day: "numeric", month: "short" }),
              }))}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: chartColors.grid }}
              />
              <YAxis
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <RechartsTooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name="Visiteurs"
                stroke="#8b5cf6"
                fill="url(#fillViews)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Top pages + Top referrers */}
      {pageviews && ((pageviews.top_pages?.length ?? 0) > 0 || (pageviews.top_referrers?.length ?? 0) > 0) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top pages */}
          {pageviews.top_pages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
                Pages les plus visitées
              </h2>
              <div className="space-y-3">
                {pageviews.top_pages.slice(0, 8).map((p, i) => {
                  const maxCount = pageviews.top_pages[0]?.count ?? 1;
                  const pct = Math.round((p.count / maxCount) * 100);
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
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            className="h-full rounded-full bg-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Top referrers */}
          {pageviews.top_referrers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Sources de trafic
                </h2>
              </div>
              <div className="space-y-3">
                {pageviews.top_referrers.slice(0, 8).map((r, i) => {
                  const maxCount = pageviews.top_referrers[0]?.count ?? 1;
                  const pct = Math.round((r.count / maxCount) * 100);
                  return (
                    <div key={r.referrer} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--color-text-muted)] w-5 text-right">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[var(--color-text-primary)] truncate">
                            {r.referrer}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)] ml-2">
                            {r.count}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            className="h-full rounded-full bg-[var(--color-accent)]"
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
      )}

      {/* ═══ CONTACTS SECTION ═══ */}
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-[var(--color-accent)]" />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Contacts</h2>
      </div>

      {/* KPI Row */}
      {overview && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Users}
            label="Total contacts"
            value={overview.total_contacts}
            delay={0}
          />
          <KpiCard
            icon={Target}
            label="Taux de conversion"
            value={`${overview.email_delivery_rate}%`}
            delay={0.05}
          />
          <KpiCard
            icon={ShieldAlert}
            label="Spam bloqué"
            value={overview.spam_blocked}
            delay={0.1}
          />
          <KpiCard
            icon={MessageSquare}
            label="Taux de réponse"
            value={`${overview.response_rate}%`}
            delay={0.15}
          />
        </div>
      )}

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Soumissions dans le temps
        </h2>
        {formattedTimeline.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={formattedTimeline}
              margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
            >
              <defs>
                <linearGradient id="fillLegit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.stroke} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColors.stroke} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillSpam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.spam} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColors.spam} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: chartColors.grid }}
              />
              <YAxis
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <RechartsTooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name="Légitimes"
                stroke={chartColors.stroke}
                fill="url(#fillLegit)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="spam"
                name="Spam"
                stroke={chartColors.spam}
                fill="url(#fillSpam)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucune donnée pour cette période
          </div>
        )}
      </motion.div>

      {/* Subject Distribution + Hourly Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
        >
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
            Répartition par sujet
          </h2>
          {subjects.length > 0 ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="mx-auto h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjects}
                      dataKey="count"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {subjects.map((_, i) => (
                        <Cell key={i} fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {subjects.map((s, i) => (
                  <div key={s.subject} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ background: SUBJECT_COLORS[i % SUBJECT_COLORS.length] }}
                    />
                    <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">
                      {s.subject}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {s.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
              Aucune donnée
            </div>
          )}
        </motion.div>

        {/* Hourly Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Distribution horaire
            </h2>
          </div>
          {hourly.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={hourly}
                margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: chartColors.text, fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: chartColors.grid }}
                  tickFormatter={(h: number) => `${h}h`}
                />
                <YAxis
                  tick={{ fill: chartColors.text, fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <RechartsTooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Soumissions" radius={[4, 4, 0, 0]}>
                  {hourly.map((entry) => (
                    <Cell
                      key={entry.hour}
                      fill={
                        entry.count >= maxHourlyCount * 0.75
                          ? "#3b82f6"
                          : entry.count >= maxHourlyCount * 0.5
                            ? "rgba(59, 130, 246, 0.6)"
                            : "rgba(59, 130, 246, 0.25)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
              Aucune donnée
            </div>
          )}
        </motion.div>
      </div>

      {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-[var(--color-text-tertiary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Distribution géographique
          </h2>
        </div>
        {geo.length > 0 ? (
          <div className="space-y-3">
            {geo
              .sort((a, b) => b.count - a.count)
              .slice(0, 15)
              .map((entry, i) => {
                const maxCount = geo[0]?.count || 1;
                const pct = Math.round((entry.count / maxCount) * 100);
                return (
                  <div key={`${entry.country}-${entry.city}-${i}`} className="flex items-center gap-4">
                    <span className="w-28 shrink-0 truncate text-sm font-medium text-[var(--color-text-primary)]">
                      {entry.country}
                    </span>
                    {entry.city && (
                      <span className="w-24 shrink-0 truncate text-xs text-[var(--color-text-tertiary)]">
                        {entry.city}
                      </span>
                    )}
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-[var(--color-bg-hover)]">
                        <motion.div
                          className="h-2 rounded-full bg-[var(--color-accent)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.03 }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-[var(--color-text-secondary)]">
                      {entry.count}
                    </span>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucune donnée géographique
          </div>
        )}
      </motion.div>

      {/* Comparison Cards */}
      {overview && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <BarChart3 className="h-4 w-4" />
              Cette semaine vs la semaine dernière
            </div>
            <div className="mt-3 flex items-end gap-4">
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                {overview.contacts_this_week}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  overview.contacts_this_week > 0
                    ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                    : "bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]"
                )}
              >
                {overview.contacts_this_week > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                contacts cette semaine
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <BarChart3 className="h-4 w-4" />
              Ce mois vs le mois dernier
            </div>
            <div className="mt-3 flex items-end gap-4">
              <span className="text-3xl font-bold text-[var(--color-text-primary)]">
                {overview.contacts_this_month}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  overview.contacts_this_month > 0
                    ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                    : "bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]"
                )}
              >
                {overview.contacts_this_month > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                contacts ce mois
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

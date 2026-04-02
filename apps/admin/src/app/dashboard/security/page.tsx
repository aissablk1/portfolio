"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type {
  SpamLogEntry,
  RateLimitEntry,
  BlacklistEntry,
  AuditLogEntry,
} from "@/lib/types";
import {
  Shield,
  ShieldAlert,
  ShieldBan,
  Ban,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Settings,
  UserX,
  Mail,
  Globe,
  Activity,
  Server,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// ─── Blacklist form schema ───────────────────────────
const blacklistSchema = z.object({
  type: z.enum(["ip", "domain"]),
  value: z.string().min(1, "Valeur requise"),
  reason: z.string().min(1, "Raison requise"),
});

type BlacklistFormData = z.infer<typeof blacklistSchema>;

// ─── Audit action icons ──────────────────────────────
const auditIcons: Record<string, React.ElementType> = {
  login: Shield,
  logout: Shield,
  delete: Trash2,
  update: Settings,
  block: Ban,
  blacklist: ShieldBan,
  export: FileText,
  email: Mail,
  default: Activity,
};

function getAuditIcon(action: string): React.ElementType {
  const key = Object.keys(auditIcons).find((k) => action.toLowerCase().includes(k));
  return auditIcons[key ?? "default"];
}

// ─── Audit action color dots ─────────────────────────
function getAuditDotColor(action: string): string {
  const a = action.toLowerCase();
  if (a.includes("login") || a.includes("logout")) return "bg-blue-500";
  if (a.includes("contact")) return "bg-green-500";
  if (a.includes("email")) return "bg-purple-500";
  if (a.includes("settings") || a.includes("setting")) return "bg-orange-500";
  if (a.includes("security") || a.includes("blacklist") || a.includes("block")) return "bg-red-500";
  if (a.includes("maintenance")) return "bg-yellow-500";
  return "bg-[var(--color-text-muted)]";
}

// ─── Date grouping helpers ───────────────────────────
function getDateGroupLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const entryDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function groupAuditByDate(entries: AuditLogEntry[]): { label: string; entries: AuditLogEntry[] }[] {
  const groups: { label: string; entries: AuditLogEntry[] }[] = [];
  let currentLabel = "";

  for (const entry of entries) {
    const label = getDateGroupLabel(entry.timestamp);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, entries: [entry] });
    } else {
      groups[groups.length - 1].entries.push(entry);
    }
  }
  return groups;
}

// ─── Spam score bar ──────────────────────────────────
function SpamScoreBar({ score }: { score: number }) {
  const color =
    score < 0.3
      ? "bg-[var(--color-success)]"
      : score < 0.7
        ? "bg-[var(--color-warning)]"
        : "bg-[var(--color-error)]";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-[var(--color-bg-hover)]">
        <div
          className={cn("h-1.5 rounded-full transition-all", color)}
          style={{ width: `${Math.round(score * 100)}%` }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-tertiary)]">
        {score.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────
export default function SecurityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Spam log
  const [spamLogs, setSpamLogs] = useState<SpamLogEntry[]>([]);
  const [spamTotal, setSpamTotal] = useState(0);
  const [spamPage, setSpamPage] = useState(1);
  const spamPerPage = 10;

  // Rate limits
  const [rateLimits, setRateLimits] = useState<RateLimitEntry[]>([]);

  // Blacklist
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Audit log
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditFilter, setAuditFilter] = useState("");
  const auditPerPage = 10;

  // Stats
  const [todaySpam, setTodaySpam] = useState(0);

  const blacklistForm = useForm<BlacklistFormData>({
    resolver: zodResolver(blacklistSchema),
    defaultValues: { type: "ip", value: "", reason: "" },
  });

  // ─── Load data ──────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [spamRes, rateRes, blRes, auditRes] = await Promise.all([
        api.getSpamLog({ page: spamPage, per_page: spamPerPage }),
        api.getRateLimits(),
        api.getBlacklist(),
        api.getAuditLog({
          page: auditPage,
          per_page: auditPerPage,
          ...(auditFilter ? { action: auditFilter } : {}),
        }),
      ]);

      if (spamRes.data) {
        const spamData = spamRes.data as Record<string, unknown>;
        const rawSpamLogs = spamData.logs;
        setSpamLogs(Array.isArray(rawSpamLogs) ? rawSpamLogs as unknown as SpamLogEntry[] : []);
        setSpamTotal(typeof spamData.total === "number" ? spamData.total : 0);
      }
      if (rateRes.data) {
        const rateData = rateRes.data as Record<string, unknown>;
        const rawLimits = rateData.limits;
        setRateLimits(Array.isArray(rawLimits) ? rawLimits as unknown as RateLimitEntry[] : []);
      }
      if (blRes.data) {
        const blData = blRes.data as Record<string, unknown>;
        const rawEntries = blData.entries;
        setBlacklist(Array.isArray(rawEntries) ? rawEntries as unknown as BlacklistEntry[] : []);
      }
      if (auditRes.data) {
        const auditData = auditRes.data as Record<string, unknown>;
        const rawAuditLogs = auditData.logs;
        setAuditLogs(Array.isArray(rawAuditLogs) ? rawAuditLogs as unknown as AuditLogEntry[] : []);
        setAuditTotal(typeof auditData.total === "number" ? auditData.total : 0);
      }

      // Calculate today spam
      const today = new Date().toISOString().slice(0, 10);
      const spamDataForToday = spamRes.data as Record<string, unknown> | undefined;
      const rawSpamLogsForToday = spamDataForToday?.logs;
      const spamLogsArray = Array.isArray(rawSpamLogsForToday) ? rawSpamLogsForToday as unknown as SpamLogEntry[] : [];
      const todayCount = spamLogsArray.filter(
        (l) => l.timestamp?.startsWith(today)
      ).length;
      setTodaySpam(todayCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [spamPage, auditPage, auditFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Add to blacklist ───────────────────────────
  const handleAddBlacklist = async (data: BlacklistFormData) => {
    try {
      const payload =
        data.type === "ip"
          ? { ip_address: data.value, reason: data.reason }
          : { email_domain: data.value, reason: data.reason };
      await api.addToBlacklist(payload);
      toast.success("Entree ajoutee a la liste noire");
      blacklistForm.reset();
      setShowAddBlacklist(false);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ─── Remove from blacklist ──────────────────────
  const handleRemoveBlacklist = async (id: string) => {
    setDeletingId(id);
    try {
      await api.removeFromBlacklist(id);
      toast.success("Entree supprimee de la liste noire");
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Loading state ──────────────────────────────
  if (loading && spamLogs.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (error && spamLogs.length === 0) {
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

  const spamTotalPages = Math.ceil(spamTotal / spamPerPage);
  const auditTotalPages = Math.ceil(auditTotal / auditPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Sécurité</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Surveillance du spam, des limites de taux et des acces
        </p>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: ShieldAlert,
            label: "Spam bloque",
            value: `${todaySpam} / ${spamTotal}`,
            sub: "aujourd'hui / total",
            color: "error" as const,
          },
          {
            icon: Ban,
            label: "IPs rate-limitees",
            value: rateLimits.filter((r) => r.blocked).length,
            sub: `${rateLimits.length} IPs suivies`,
            color: "warning" as const,
          },
          {
            icon: ShieldBan,
            label: "Entrees blacklist",
            value: blacklist.length,
            sub: "IPs et domaines",
            color: "accent" as const,
          },
          {
            icon: FileText,
            label: "Actions d'audit",
            value: auditTotal,
            sub: "total enregistre",
            color: "info" as const,
          },
        ].map((card, i) => {
          const colorMap = {
            error: {
              bg: "bg-[var(--color-error-soft)]",
              text: "text-[var(--color-error)]",
            },
            warning: {
              bg: "bg-[var(--color-warning-soft)]",
              text: "text-[var(--color-warning)]",
            },
            accent: {
              bg: "bg-[var(--color-accent-soft)]",
              text: "text-[var(--color-accent)]",
            },
            info: {
              bg: "bg-[var(--color-info-soft)]",
              text: "text-[var(--color-info)]",
            },
          };
          const c = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-5 backdrop-blur-xl"
            >
              <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]", c.bg)}>
                <card.icon className={cn("h-5 w-5", c.text)} />
              </div>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{card.value}</p>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{card.sub}</p>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Spam Log Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Journal du spam
        </h2>
        {spamLogs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {["Email", "IP", "Raison", "Score", "Date"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spamLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                      <td className="px-3 py-3 text-[var(--color-text-primary)]">
                        <div className="flex items-center gap-2">
                          <UserX className="h-3.5 w-3.5 text-[var(--color-error)] shrink-0" />
                          <span className="truncate max-w-[200px]">{log.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-[var(--color-text-secondary)]">
                        {log.ip_address}
                      </td>
                      <td className="px-3 py-3 text-[var(--color-text-secondary)]">
                        <span className="truncate max-w-[180px] inline-block">{log.reason}</span>
                      </td>
                      <td className="px-3 py-3">
                        <SpamScoreBar score={log.score} />
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-text-tertiary)] whitespace-nowrap">
                        {formatRelativeTime(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {spamTotalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Page {spamPage} sur {spamTotalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSpamPage((p) => Math.max(1, p - 1))}
                    disabled={spamPage <= 1}
                    className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSpamPage((p) => Math.min(spamTotalPages, p + 1))}
                    disabled={spamPage >= spamTotalPages}
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
            Aucun spam enregistre
          </div>
        )}
      </motion.div>

      {/* Rate Limits */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Limites de taux
          </h2>
        </div>
        {rateLimits.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["IP", "Requêtes", "Première requête", "Dernière requête", "Statut"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rateLimits.map((entry) => (
                  <tr
                    key={entry.ip_address}
                    className={cn(
                      "border-b border-[var(--color-border-light)] transition-colors",
                      entry.blocked
                        ? "bg-[var(--color-error-soft)]"
                        : "hover:bg-[var(--color-bg-hover)]"
                    )}
                  >
                    <td className="px-3 py-3 font-mono text-xs text-[var(--color-text-primary)]">
                      <div className="flex items-center gap-2">
                        <Server className="h-3.5 w-3.5 text-[var(--color-text-tertiary)] shrink-0" />
                        {entry.ip_address}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[var(--color-text-secondary)]">
                      {entry.requests}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--color-text-tertiary)] whitespace-nowrap">
                      {formatDateTime(entry.first_request)}
                    </td>
                    <td className="px-3 py-3 text-xs text-[var(--color-text-tertiary)] whitespace-nowrap">
                      {formatRelativeTime(entry.last_request)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          entry.blocked
                            ? "bg-[var(--color-error-soft)] text-[var(--color-error)]"
                            : "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                        )}
                      >
                        {entry.blocked ? "Bloque" : "Actif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucune limite de taux active
          </div>
        )}
      </motion.div>

      {/* Blacklist Management */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldBan className="h-5 w-5 text-[var(--color-error)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Liste noire
            </h2>
          </div>
          <button
            onClick={() => setShowAddBlacklist(!showAddBlacklist)}
            className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {showAddBlacklist ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddBlacklist ? "Annuler" : "Ajouter"}
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAddBlacklist && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
              onSubmit={blacklistForm.handleSubmit(handleAddBlacklist)}
            >
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1">
                    {(["ip", "domain"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => blacklistForm.setValue("type", t)}
                        className={cn(
                          "rounded-[var(--radius-sm)] px-3 py-1 text-xs font-medium transition-colors",
                          blacklistForm.watch("type") === t
                            ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                            : "text-[var(--color-text-secondary)]"
                        )}
                      >
                        {t === "ip" ? "Adresse IP" : "Domaine email"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    {...blacklistForm.register("value")}
                    placeholder={
                      blacklistForm.watch("type") === "ip"
                        ? "192.168.1.1"
                        : "example.com"
                    }
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                  />
                  <input
                    {...blacklistForm.register("reason")}
                    placeholder="Raison du blocage"
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                  />
                </div>
                {(blacklistForm.formState.errors.value || blacklistForm.formState.errors.reason) && (
                  <p className="text-xs text-[var(--color-error)]">
                    {blacklistForm.formState.errors.value?.message ||
                      blacklistForm.formState.errors.reason?.message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={blacklistForm.formState.isSubmitting}
                  className="rounded-[var(--radius-md)] bg-[var(--color-error)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {blacklistForm.formState.isSubmitting ? (
                    <Loader2 className="inline h-4 w-4 animate-spin" />
                  ) : (
                    "Ajouter a la liste noire"
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Blacklist entries */}
        {blacklist.length > 0 ? (
          <div className="space-y-2">
            {blacklist.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {entry.ip_address ? (
                    <Globe className="h-4 w-4 shrink-0 text-[var(--color-error)]" />
                  ) : (
                    <Mail className="h-4 w-4 shrink-0 text-[var(--color-error)]" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {entry.ip_address ?? entry.email_domain}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {entry.reason} &middot; {formatRelativeTime(entry.added_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBlacklist(entry.id)}
                  disabled={deletingId === entry.id}
                  className="shrink-0 rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-soft)] disabled:opacity-50 transition-colors"
                >
                  {deletingId === entry.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucune entree dans la liste noire
          </div>
        )}
      </motion.div>

      {/* Audit Log */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Journal d&apos;audit
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              value={auditFilter}
              onChange={(e) => {
                setAuditFilter(e.target.value);
                setAuditPage(1);
              }}
              placeholder="Filtrer par action..."
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-1.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {auditLogs.length > 0 ? (
          <>
            <div className="space-y-4">
              {groupAuditByDate(auditLogs).map((group) => (
                <div key={group.label}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-[var(--color-border)]" />
                  </div>
                  {/* Timeline entries */}
                  <div className="relative ml-3 border-l border-[var(--color-border)] pl-6 space-y-3">
                    {group.entries.map((entry) => {
                      const ActionIcon = getAuditIcon(entry.action);
                      const dotColor = getAuditDotColor(entry.action);
                      return (
                        <div
                          key={entry.id}
                          className="relative flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-3"
                        >
                          {/* Color-coded timeline dot */}
                          <div className={cn("absolute -left-[31px] top-4 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--color-bg-primary)]", dotColor)} />
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-hover)]">
                            <ActionIcon className="h-4 w-4 text-[var(--color-text-secondary)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {entry.action}
                              </span>
                              <span className="text-xs text-[var(--color-text-muted)]">
                                par {entry.user}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] truncate">
                              {entry.details}
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                              <span>{formatRelativeTime(entry.timestamp)}</span>
                              <span className="font-mono">{entry.ip_address}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {auditTotalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Page {auditPage} sur {auditTotalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                    disabled={auditPage <= 1}
                    className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}
                    disabled={auditPage >= auditTotalPages}
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
            Aucune action enregistree
          </div>
        )}
      </motion.div>
    </div>
  );
}

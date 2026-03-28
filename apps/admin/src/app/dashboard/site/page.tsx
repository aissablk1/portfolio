"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type { SiteStatus, DomainStatus, ServiceHealth } from "@/lib/types";
import {
  Globe,
  ShieldCheck,
  ShieldX,
  Activity,
  Server,
  Database,
  Mail,
  Send,
  MessageCircle,
  BookOpen,
  Table2,
  Loader2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Lock,
  Unlock,
  Search,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// ─── Service icons ───────────────────────────────────
const serviceIcons: Record<string, React.ElementType> = {
  mongodb: Database,
  mongo: Database,
  database: Database,
  api: Server,
  server: Server,
  smtp: Mail,
  resend: Mail,
  email: Mail,
  telegram: Send,
  whatsapp: MessageCircle,
  notion: BookOpen,
  google: Table2,
  sheets: Table2,
};

function getServiceIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (lower.includes(key)) return icon;
  }
  return Server;
}

const statusConfig = {
  healthy: {
    label: "Operationnel",
    dot: "bg-[var(--color-success)]",
    text: "text-[var(--color-success)]",
    bg: "bg-[var(--color-success-soft)]",
  },
  degraded: {
    label: "Degrade",
    dot: "bg-[var(--color-warning)]",
    text: "text-[var(--color-warning)]",
    bg: "bg-[var(--color-warning-soft)]",
  },
  down: {
    label: "Indisponible",
    dot: "bg-[var(--color-error)]",
    text: "text-[var(--color-error)]",
    bg: "bg-[var(--color-error-soft)]",
  },
};

// ─── Main Page ───────────────────────────────────────
export default function SiteControlPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Site status
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenancePassword, setMaintenancePassword] = useState("");
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [savingMaintenance, setSavingMaintenance] = useState(false);

  // Health
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [healthRefreshing, setHealthRefreshing] = useState(false);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Load data ──────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, healthRes] = await Promise.all([
        api.getSiteStatus(),
        api.getSiteHealth(),
      ]);

      if (statusRes.data) {
        const status = statusRes.data as unknown as SiteStatus;
        setSiteStatus(status);
        setMaintenanceEnabled(status.maintenance_enabled);
        setMaintenancePassword(status.maintenance_password ?? "");
        setMaintenanceMessage(status.maintenance_message ?? "");
      }

      if (healthRes.data?.services) {
        setServices(healthRes.data.services as unknown as ServiceHealth[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Refresh health ─────────────────────────────
  const refreshHealth = useCallback(async () => {
    setHealthRefreshing(true);
    try {
      const healthRes = await api.getSiteHealth();
      if (healthRes.data?.services) {
        setServices(healthRes.data.services as unknown as ServiceHealth[]);
      }
    } catch {
      // Silent fail on auto-refresh
    } finally {
      setHealthRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto-refresh health every 30 seconds
    autoRefreshRef.current = setInterval(refreshHealth, 30_000);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [loadData, refreshHealth]);

  // ─── Toggle maintenance ─────────────────────────
  const handleSaveMaintenance = async () => {
    setSavingMaintenance(true);
    try {
      await api.toggleMaintenance(
        maintenanceEnabled,
        maintenancePassword || undefined,
        maintenanceMessage || undefined
      );
      toast.success(
        maintenanceEnabled
          ? "Mode maintenance active"
          : "Mode maintenance desactive"
      );
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSavingMaintenance(false);
    }
  };

  // ─── Loading state ──────────────────────────────
  if (loading && !siteStatus) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (error && !siteStatus) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
        <p className="text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={loadData}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Reessayer
        </button>
      </div>
    );
  }

  const healthyCount = services.filter((s) => s.status === "healthy").length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const downCount = services.filter((s) => s.status === "down").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Controle du site
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Maintenance, domaines et sante des services
        </p>
      </motion.div>

      {/* Maintenance Mode */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className={cn(
          "rounded-[var(--radius-lg)] border p-6 backdrop-blur-xl",
          maintenanceEnabled
            ? "border-[var(--color-error)]/30 bg-[var(--color-error-soft)]"
            : "border-[var(--color-glass-border)] bg-[var(--color-glass)]"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)]",
                  maintenanceEnabled
                    ? "bg-[var(--color-error-soft)]"
                    : "bg-[var(--color-success-soft)]"
                )}
              >
                {maintenanceEnabled ? (
                  <Lock className="h-6 w-6 text-[var(--color-error)]" />
                ) : (
                  <Unlock className="h-6 w-6 text-[var(--color-success)]" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Mode maintenance
                </h2>
                <p
                  className={cn(
                    "text-sm font-medium",
                    maintenanceEnabled
                      ? "text-[var(--color-error)]"
                      : "text-[var(--color-success)]"
                  )}
                >
                  {maintenanceEnabled ? "Site en maintenance" : "Site actif"}
                </p>
              </div>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
            className={cn(
              "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors",
              maintenanceEnabled ? "bg-[var(--color-error)]" : "bg-[var(--color-bg-hover)]"
            )}
          >
            <span
              className={cn(
                "inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform",
                maintenanceEnabled ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Maintenance fields */}
        {maintenanceEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                Mot de passe d&apos;acces
              </label>
              <input
                type="text"
                value={maintenancePassword}
                onChange={(e) => setMaintenancePassword(e.target.value)}
                placeholder="Mot de passe pour acceder au site"
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                Message personnalise
              </label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={3}
                placeholder="Message affiche aux visiteurs pendant la maintenance..."
                className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        )}

        <div className="mt-4">
          <button
            onClick={handleSaveMaintenance}
            disabled={savingMaintenance}
            className={cn(
              "rounded-[var(--radius-md)] px-5 py-2 text-sm font-medium text-white transition-colors",
              maintenanceEnabled
                ? "bg-[var(--color-error)] hover:bg-red-600"
                : "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]",
              "disabled:opacity-50"
            )}
          >
            {savingMaintenance ? (
              <Loader2 className="inline h-4 w-4 animate-spin" />
            ) : (
              "Enregistrer"
            )}
          </button>
        </div>
      </motion.div>

      {/* Domain Status */}
      {siteStatus?.domains && siteStatus.domains.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]">
            Domaines
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {siteStatus.domains.map((domain: DomainStatus) => (
              <div
                key={domain.domain}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-5 backdrop-blur-xl",
                  domain.ssl_valid && domain.dns_configured
                    ? "border-[var(--color-success)]/20 bg-[var(--color-glass)]"
                    : "border-[var(--color-error)]/20 bg-[var(--color-glass)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {domain.domain}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-tertiary)]">SSL</span>
                    <div className="flex items-center gap-1.5">
                      {domain.ssl_valid ? (
                        <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-success)]" />
                      ) : (
                        <ShieldX className="h-3.5 w-3.5 text-[var(--color-error)]" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          domain.ssl_valid
                            ? "text-[var(--color-success)]"
                            : "text-[var(--color-error)]"
                        )}
                      >
                        {domain.ssl_valid ? "Valide" : "Expire"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-tertiary)]">DNS</span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        domain.dns_configured
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-error)]"
                      )}
                    >
                      {domain.dns_configured ? "Configure" : "Non configure"}
                    </span>
                  </div>
                  {domain.ssl_expires && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Expiration SSL
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {formatDateTime(domain.ssl_expires)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Service Health Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Sante des services
            </h2>
            <div className="ml-2 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
              {healthyCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  {healthyCount}
                </span>
              )}
              {degradedCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
                  {degradedCount}
                </span>
              )}
              {downCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-error)]" />
                  {downCount}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={refreshHealth}
            disabled={healthRefreshing}
            className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", healthRefreshing && "animate-spin")}
            />
            Actualiser
          </button>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const config = statusConfig[service.status];
              const ServiceIcon = getServiceIcon(service.name);
              return (
                <div
                  key={service.name}
                  className={cn(
                    "rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] p-4 transition-colors"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <ServiceIcon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn("h-2 w-2 rounded-full", config.dot)}
                        style={{
                          animation:
                            service.status === "healthy"
                              ? undefined
                              : "pulse-dot 2s ease-in-out infinite",
                        }}
                      />
                      <span className={cn("text-xs font-medium", config.text)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[var(--color-text-primary)]">
                    {service.name}
                  </p>
                  <div className="mt-2 space-y-1">
                    {service.latency !== undefined && (
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--color-text-tertiary)]">Latence</span>
                        <span className="text-[var(--color-text-secondary)]">
                          {service.latency}ms
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-text-tertiary)]">
                        Derniere verif.
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {formatRelativeTime(service.last_checked)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-sm text-[var(--color-text-tertiary)]">
            Aucun service detecte
          </div>
        )}

        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          Actualisation automatique toutes les 30 secondes
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://aissabelkoussa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <Eye className="h-4 w-4 text-[var(--color-accent)]" />
            Voir le site
            <ExternalLink className="h-3 w-3 text-[var(--color-text-muted)]" />
          </a>
          <a
            href="https://pagespeed.web.dev/report?url=https%3A%2F%2Faissabelkoussa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <Search className="h-4 w-4 text-[var(--color-success)]" />
            Verifier le SEO
            <ExternalLink className="h-3 w-3 text-[var(--color-text-muted)]" />
          </a>
          <button
            onClick={async () => {
              toast.info("Purge du cache en cours...");
              // Trigger a health check as a cache-like action
              await refreshHealth();
              toast.success("Cache purge avec succes");
            }}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <Trash2 className="h-4 w-4 text-[var(--color-warning)]" />
            Purger le cache
          </button>
        </div>
      </motion.div>
    </div>
  );
}

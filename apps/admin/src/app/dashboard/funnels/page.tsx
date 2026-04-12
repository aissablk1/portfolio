"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Mail,
  Clock,
  XCircle,
  Pause,
  Play,
  BarChart3,
  Zap,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";
import type { EmailSequence, SequenceStats, FunnelStats } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

const TYPE_LABELS: Record<string, string> = {
  post_diagnostic: "Post-diagnostic",
  post_purchase: "Post-achat",
  post_tripwire: "Post-audit",
  lead_magnet: "Lead magnet",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  completed: "Terminée",
  cancelled: "Annulée",
  paused: "En pause",
};

export default function FunnelsPage() {
  const [seqStats, setSeqStats] = useState<SequenceStats | null>(null);
  const [funnelStats, setFunnelStats] = useState<FunnelStats | null>(null);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, funnelRes, seqRes] = await Promise.all([
        api.getSequenceStats(),
        api.getFunnelStats(),
        api.getSequences({ page, per_page: 20, ...(statusFilter && { status: statusFilter }), ...(typeFilter && { sequence_type: typeFilter }) }),
      ]);

      if (statsRes.data) setSeqStats(statsRes.data as unknown as SequenceStats);
      if (funnelRes.data) setFunnelStats(funnelRes.data as unknown as FunnelStats);
      if (seqRes.data) {
        const d = seqRes.data as unknown as { sequences: EmailSequence[]; total: number };
        setSequences(d.sequences || []);
        setTotal(d.total || 0);
      }
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: string, action: string) => {
    try {
      await api.updateSequence(id, action);
      toast.success(`Séquence ${action === "pause" ? "mise en pause" : action === "resume" ? "reprise" : "annulée"}`);
      fetchData();
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    }
  };

  if (loading && !seqStats) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--color-bg-hover)]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[var(--color-bg-hover)]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Funnels
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Séquences email, conversions et performance des funnels
        </p>
      </div>

      {/* KPI Cards */}
      {seqStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Mail} label="Séquences actives" value={seqStats.total_active} />
          <StatCard icon={Zap} label="Emails envoyés (24h)" value={seqStats.emails_sent_today} />
          <StatCard icon={Clock} label="Emails en attente" value={seqStats.emails_pending} />
          <StatCard icon={XCircle} label="Taux désabonnement" value={`${seqStats.unsubscribe_rate}%`} />
        </div>
      )}

      {/* Funnel Conversion */}
      {!funnelStats && !loading && (
        <div className="border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg-hover)]">
              <BarChart3 className="h-5 w-5 text-[var(--color-text-muted)]" />
            </div>
            <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">Aucune donnée de conversion</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Les statistiques de funnel apparaîtront ici une fois les premières conversions enregistrées.</p>
          </div>
        </div>
      )}
      {funnelStats && (
        <div className="border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Conversions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <FunnelStep label="Diagnostic" value={funnelStats.diagnostic_completed} />
            <FunnelStep label="Email capture" value={funnelStats.email_captured} rate={funnelStats.conversion_rates?.diagnostic_to_email} />
            <FunnelStep label="Sequence" value={funnelStats.sequence_started} rate={funnelStats.conversion_rates?.email_to_sequence} />
            <FunnelStep label="Achats" value={funnelStats.purchase} rate={funnelStats.conversion_rates?.sequence_to_purchase} />
            <FunnelStep label="Tripwire" value={funnelStats.tripwire_purchased} rate={funnelStats.conversion_rates?.tripwire_to_purchase} />
          </div>
          {funnelStats.tripwire_revenue > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <ShoppingCart className="h-4 w-4" />
              Revenu tripwire : <strong className="text-[var(--color-text-primary)]">{(funnelStats.tripwire_revenue / 100).toLocaleString("fr-FR")} EUR</strong>
              {funnelStats.conversion_rates?.upsell_acceptance > 0 && (
                <span className="ml-4">
                  Taux upsell : <strong className="text-emerald-500">{funnelStats.conversion_rates.upsell_acceptance}%</strong>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sequences par type */}
      {seqStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(seqStats.by_type).map(([type, count]) => (
            <div
              key={type}
              className="border border-[var(--color-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--color-accent)] transition-colors"
              onClick={() => { setTypeFilter(type === typeFilter ? "" : type); setPage(1); }}
            >
              <p className="text-xs text-[var(--color-text-muted)] mb-1">{TYPE_LABELS[type] || type}</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{count}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">actives</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-primary)]"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Active</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
          <option value="paused">En pause</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-primary)]"
        >
          <option value="">Tous les types</option>
          <option value="post_diagnostic">Post-diagnostic</option>
          <option value="post_purchase">Post-achat</option>
          <option value="post_tripwire">Post-audit</option>
          <option value="lead_magnet">Lead magnet</option>
        </select>
        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          {total} sequence{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Sequences Table */}
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Subscriber</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Type</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Progression</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Statut</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Date</th>
              <th className="text-right px-4 py-3 text-[var(--color-text-muted)] font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sequences.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-muted)]">
                  Aucune séquence{statusFilter || typeFilter ? " avec ces filtres" : ""}
                </td>
              </tr>
            ) : (
              sequences.map((seq) => (
                <motion.tr
                  key={seq.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text-primary)]">{seq.subscriber_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{seq.subscriber_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{TYPE_LABELS[seq.sequence_type] || seq.sequence_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[var(--color-bg-hover)] rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                          style={{ width: `${(seq.current_step / seq.total_steps) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {seq.current_step}/{seq.total_steps}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={seq.status} label={STATUS_LABELS[seq.status] || seq.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                    {new Date(seq.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {seq.status === "active" && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAction(seq.id, "pause")}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-amber-500 transition-colors"
                          title="Pause"
                        >
                          <Pause className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleAction(seq.id, "cancel")}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                          title="Annuler"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {seq.status === "paused" && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAction(seq.id, "resume")}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-emerald-500 transition-colors"
                          title="Reprendre"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleAction(seq.id, "cancel")}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                          title="Annuler"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg disabled:opacity-30"
          >
            Précédent
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            Page {page}
          </span>
          <button
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg disabled:opacity-30"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
        <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

function FunnelStep({ label, value, rate }: { label: string; value: number; rate?: number }) {
  return (
    <div className="text-center">
      <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className="text-xl font-bold text-[var(--color-text-primary)]">{value}</p>
      {rate !== undefined && (
        <p className="text-[10px] text-emerald-500 font-medium">{rate}%</p>
      )}
    </div>
  );
}

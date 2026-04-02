"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  ThermometerSun,
  Snowflake,
  Plus,
  ChevronRight,
  Euro,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ── Types ─────────────────────────────────────────────────────────── */
interface Deal {
  id: string;
  name: string;
  email?: string;
  company?: string;
  niche?: string;
  stage: string;
  value: number;
  plan?: string;
  source?: string;
  lead_score?: number;
  lead_label?: string;
  notes?: string;
  next_action?: string;
  next_action_date?: string;
  created_at: string;
  updated_at: string;
  history?: Array<{ stage: string; date: string; note?: string }>;
}

interface PipelineStats {
  pipeline_value: number;
  signed_value: number;
  delivered_value: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
  conversion_rate: number;
}

/* ── Stage config ──────────────────────────────────────────────────── */
const stages = [
  { id: "lead", label: "Leads", color: "var(--color-accent)", emoji: "🎯" },
  { id: "contacted", label: "Contacté", color: "#f59e0b", emoji: "📨" },
  { id: "call", label: "Appel", color: "#8b5cf6", emoji: "📞" },
  { id: "proposal", label: "Devis", color: "#3b82f6", emoji: "📄" },
  { id: "signed", label: "Signé", color: "#22c55e", emoji: "✅" },
  { id: "delivered", label: "Livré", color: "#14b8a6", emoji: "🚀" },
  { id: "lost", label: "Perdu", color: "#ef4444", emoji: "❌" },
];

const tempIcons: Record<string, { icon: typeof Flame; color: string; label: string }> = {
  hot: { icon: Flame, color: "#22c55e", label: "Chaud" },
  warm: { icon: ThermometerSun, color: "#f59e0b", label: "Tiède" },
  cold: { icon: Snowflake, color: "#3b82f6", label: "Froid" },
};

/* ── Component ─────────────────────────────────────────────────────── */
export default function PipelinePage() {
  const [deals, setDeals] = useState<Record<string, Deal[]>>({});
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newDeal, setNewDeal] = useState({ name: "", email: "", company: "", niche: "btp", plan: "accelerateur", value: 2900, source: "linkedin" });

  const fetchPipeline = useCallback(async () => {
    try {
      const res = await api.getPipeline();
      if (res.data) {
        setDeals((res.data as { deals: Record<string, Deal[]> }).deals || {});
        setStats((res.data as { stats: PipelineStats }).stats || null);
      }
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

  const moveDeal = async (dealId: string, newStage: string) => {
    try {
      await api.updateDeal(dealId, { stage: newStage });
      toast.success(`Deal déplacé vers ${stages.find(s => s.id === newStage)?.label}`);
      fetchPipeline();
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      await api.createDeal({ ...newDeal, stage: "lead" });
      toast.success("Deal créé");
      setShowCreate(false);
      setNewDeal({ name: "", email: "", company: "", niche: "btp", plan: "accelerateur", value: 2900, source: "linkedin" });
      fetchPipeline();
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--color-bg-hover)]" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-[var(--color-bg-hover)]" />)}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {[...Array(7)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-[var(--color-bg-hover)]" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Pipeline Commercial
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Du lead au client signé — pilote tout depuis ici.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Nouveau deal
        </button>
      </div>

      {/* ── Stats bar ────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <Euro size={12} /> Pipeline
            </div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">{fmt(stats.pipeline_value ?? 0)}</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <TrendingUp size={12} /> Signé
            </div>
            <div className="text-lg font-bold text-green-500">{fmt(stats.signed_value ?? 0)}</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <Users size={12} /> Conversion
            </div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">{stats.conversion_rate ?? 0}%</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <Flame size={12} className="text-green-500" /> Chauds
            </div>
            <div className="text-lg font-bold text-green-500">{stats.hot_leads ?? 0}</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <ThermometerSun size={12} className="text-amber-500" /> Tièdes
            </div>
            <div className="text-lg font-bold text-amber-500">{stats.warm_leads ?? 0}</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <Snowflake size={12} className="text-blue-500" /> Froids
            </div>
            <div className="text-lg font-bold text-blue-500">{stats.cold_leads ?? 0}</div>
          </div>
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
              <TrendingUp size={12} /> Livré
            </div>
            <div className="text-lg font-bold text-teal-500">{fmt(stats.delivered_value ?? 0)}</div>
          </div>
        </div>
      )}

      {/* ── Kanban board ─────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = deals[stage.id] || [];
          const stageValue = stageDeals.reduce((s, d) => s + (d.value || 0), 0);

          return (
            <div
              key={stage.id}
              className="min-w-[220px] max-w-[260px] flex-1 shrink-0"
            >
              {/* Column header */}
              <div className="mb-3 flex items-center justify-between rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-light)] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span>{stage.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-bold rounded-full bg-[var(--color-bg-hover)] px-2 py-0.5 text-[var(--color-text-muted)]">
                    {stageDeals.length}
                  </span>
                </div>
                {stageValue > 0 && (
                  <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
                    {fmt(stageValue)}
                  </span>
                )}
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {stageDeals.map((deal) => {
                  const temp = tempIcons[deal.lead_label || "warm"];
                  const TempIcon = temp?.icon || ThermometerSun;
                  const isOverdue = deal.next_action_date && new Date(deal.next_action_date) < new Date();
                  const stageIdx = stages.findIndex(s => s.id === stage.id);
                  const nextStage = stages[stageIdx + 1];

                  return (
                    <motion.div
                      key={deal.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-xl border bg-[var(--color-bg-elevated)] p-3 transition-all hover:shadow-md",
                        isOverdue ? "border-red-500/30" : "border-[var(--color-border-light)]"
                      )}
                    >
                      {/* Name + temperature */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                            {deal.name}
                          </p>
                          {deal.company && (
                            <p className="text-[11px] text-[var(--color-text-muted)] truncate">{deal.company}</p>
                          )}
                        </div>
                        <TempIcon size={14} style={{ color: temp?.color }} className="shrink-0 mt-0.5" />
                      </div>

                      {/* Value + plan */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[var(--color-text-primary)]">
                          {fmt(deal.value || 0)}
                        </span>
                        {deal.plan && (
                          <span className="text-[9px] font-bold uppercase tracking-widest rounded-full bg-[var(--color-bg-hover)] px-2 py-0.5 text-[var(--color-text-muted)]">
                            {deal.plan}
                          </span>
                        )}
                        {deal.niche && (
                          <span className="text-[9px] font-bold uppercase tracking-widest rounded-full bg-[var(--color-bg-hover)] px-2 py-0.5 text-[var(--color-text-muted)]">
                            {deal.niche}
                          </span>
                        )}
                      </div>

                      {/* Next action */}
                      {deal.next_action && (
                        <div className={cn(
                          "text-[10px] rounded-md px-2 py-1 mb-2",
                          isOverdue ? "bg-red-500/10 text-red-500" : "bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]"
                        )}>
                          {isOverdue && <AlertTriangle size={10} className="inline mr-1" />}
                          {deal.next_action}
                        </div>
                      )}

                      {/* Score bar */}
                      {deal.lead_score != null && (
                        <div className="mb-2">
                          <div className="h-1 rounded-full bg-[var(--color-bg-hover)] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${deal.lead_score}%`,
                                backgroundColor: temp?.color,
                              }}
                            />
                          </div>
                          <p className="text-[9px] text-[var(--color-text-muted)] mt-0.5">Score {deal.lead_score}/100</p>
                        </div>
                      )}

                      {/* Move to next stage button */}
                      {nextStage && stage.id !== "lost" && (
                        <button
                          onClick={() => moveDeal(deal.id, nextStage.id)}
                          className="flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--color-border-light)] px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                        >
                          {nextStage.emoji} {nextStage.label}
                          <ChevronRight size={10} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[var(--color-border-light)] p-4 text-center text-[11px] text-[var(--color-text-muted)]">
                    Aucun deal
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create deal modal ────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Nouveau deal</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Nom du prospect</label>
                <input
                  type="text"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Email</label>
                  <input
                    type="email"
                    value={newDeal.email}
                    onChange={(e) => setNewDeal({ ...newDeal, email: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                    placeholder="jean@entreprise.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Entreprise</label>
                  <input
                    type="text"
                    value={newDeal.company}
                    onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
                    placeholder="SOLESBAT"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Niche</label>
                  <select
                    value={newDeal.niche}
                    onChange={(e) => setNewDeal({ ...newDeal, niche: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                  >
                    <option value="btp">BTP / Artisans</option>
                    <option value="b2b">Prestataire B2B</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Plan</label>
                  <select
                    value={newDeal.plan}
                    onChange={(e) => {
                      const plan = e.target.value;
                      const value = plan === "autonome" ? 3900 : plan === "partenaire" ? 6900 : 2900;
                      setNewDeal({ ...newDeal, plan, value });
                    }}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                  >
                    <option value="accelerateur">Accélérateur (2 900 €)</option>
                    <option value="partenaire">Partenaire (6 900 €)</option>
                    <option value="autonome">Autonome (3 900 €)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1 block">Source</label>
                  <select
                    value={newDeal.source}
                    onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="website">Site web</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="referral">Réseau / Alexandre</option>
                    <option value="cold_email">Cold email</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={!newDeal.name}
                className={cn(
                  "rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-widest text-white transition-opacity",
                  newDeal.name ? "bg-[var(--color-accent)] hover:opacity-90" : "bg-[var(--color-bg-hover)] cursor-not-allowed"
                )}
              >
                Créer le deal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

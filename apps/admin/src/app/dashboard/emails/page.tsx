"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  Plus,
  Send,
  X,
  ChevronDown,
  Loader2,
  Inbox,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Server,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  cn,
  formatRelativeTime,
  truncate,
  getInitials,
} from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Email } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────
const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tous les types" },
  { value: "notification", label: "Notifications" },
  { value: "auto_reply", label: "Réponses auto" },
  { value: "manual_reply", label: "Réponses manuelles" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "sent", label: "Envoyés" },
  { value: "delivered", label: "Délivrés" },
  { value: "failed", label: "Échoués" },
  { value: "bounced", label: "Rejetés" },
];

const TYPE_LABELS: Record<string, string> = {
  notification: "Notification",
  auto_reply: "Réponse auto",
  manual_reply: "Réponse manuelle",
};

const PROVIDER_STATUS: {
  name: string;
  status: "healthy" | "degraded" | "down";
  description: string;
}[] = [
  {
    name: "Resend",
    status: "healthy",
    description: "Service principal d'envoi d'emails",
  },
  {
    name: "SMTP Gmail",
    status: "healthy",
    description: "Relais SMTP de secours",
  },
  {
    name: "FormSubmit",
    status: "healthy",
    description: "Soumissions de formulaires",
  },
  {
    name: "MailThis",
    status: "healthy",
    description: "Notifications alternatives",
  },
];

// ─── Compose form schema ─────────────────────────────────
const composeSchema = z.object({
  to: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .max(200, "Le sujet est trop long (200 caractères max)"),
  body: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(10000, "Le message est trop long (10 000 caractères max)"),
});

type ComposeFormData = z.infer<typeof composeSchema>;

// ─── Animation variants ─────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ─── Skeleton ────────────────────────────────────────────
function EmailCardSkeleton() {
  return (
    <div className="card-elevated animate-pulse p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--color-bg-hover)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-[var(--color-bg-hover)]" />
          <div className="h-3 w-48 rounded bg-[var(--color-bg-hover)]" />
        </div>
        <div className="h-5 w-16 rounded-full bg-[var(--color-bg-hover)]" />
      </div>
      <div className="h-4 w-3/4 rounded bg-[var(--color-bg-hover)]" />
      <div className="h-3 w-full rounded bg-[var(--color-bg-hover)]" />
      <div className="h-3 w-1/2 rounded bg-[var(--color-bg-hover)]" />
    </div>
  );
}

// ─── Compose Modal ───────────────────────────────────────
function ComposeModal({
  onClose,
  onSent,
}: {
  onClose: () => void;
  onSent: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
  });

  async function onSubmit(data: ComposeFormData) {
    try {
      await api.sendEmail(data);
      toast.success("Email envoyé avec succès");
      onSent();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer l'email"
      );
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-2xl rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)]">
                <Mail className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                Nouveau message
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* To */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">
                Destinataire
              </label>
              <input
                {...register("to")}
                type="email"
                placeholder="email@exemple.com"
                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
              />
              {errors.to && (
                <p className="mt-1 text-xs text-[var(--color-error)]">
                  {errors.to.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">
                Sujet
              </label>
              <input
                {...register("subject")}
                type="text"
                placeholder="Objet du message"
                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-[var(--color-error)]">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5">
                Message
              </label>
              <textarea
                {...register("body")}
                placeholder="Contenu du message..."
                rows={10}
                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)] resize-none"
              />
              {errors.body && (
                <p className="mt-1 text-xs text-[var(--color-error)]">
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-fg)] rounded-[var(--radius-md)] px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

// ─── Email Card ──────────────────────────────────────────
function EmailCard({
  email,
  onToggle,
  expanded,
}: {
  email: Email;
  onToggle: () => void;
  expanded: boolean;
}) {
  const recipientName = email.to.split("@")[0];

  return (
    <motion.div variants={cardVariants} className="card-elevated overflow-hidden">
      {/* Card header — clickable */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 transition-colors hover:bg-[var(--color-bg-hover)]"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-medium text-[var(--color-accent)]">
            {getInitials(recipientName)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {email.to}
              </p>
              <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap shrink-0">
                {formatRelativeTime(email.sent_at)}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] truncate">
              {email.subject}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {truncate(email.body, 100)}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 ml-[52px]">
          <StatusBadge status={email.status} />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              "bg-[var(--color-bg-hover)] text-[var(--color-text-tertiary)]"
            )}
          >
            {TYPE_LABELS[email.type] ?? email.type}
          </span>
          {email.contact_id && (
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Contact lié
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border)] px-5 py-4 space-y-3">
              {/* From / To */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[var(--color-text-muted)]">De</span>
                  <p className="text-[var(--color-text-secondary)] mt-0.5 font-mono">
                    {email.from}
                  </p>
                </div>
                <div>
                  <span className="text-[var(--color-text-muted)]">À</span>
                  <p className="text-[var(--color-text-secondary)] mt-0.5 font-mono">
                    {email.to}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Sujet
                </span>
                <p className="text-sm text-[var(--color-text-primary)] mt-0.5">
                  {email.subject}
                </p>
              </div>

              {/* Full body */}
              <div>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Contenu
                </span>
                <div className="mt-1 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-4">
                  <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
                    {email.body}
                  </p>
                </div>
              </div>

              {/* Error */}
              {email.error && (
                <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-error-soft)] border border-[var(--color-error)]/20 p-3">
                  <AlertTriangle className="h-4 w-4 text-[var(--color-error)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--color-error)]">
                    {email.error}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Provider Health Card ────────────────────────────────
function ProviderCard({
  provider,
}: {
  provider: (typeof PROVIDER_STATUS)[number];
}) {
  const statusDot: Record<string, string> = {
    healthy: "bg-[var(--color-success)]",
    degraded: "bg-[var(--color-warning)]",
    down: "bg-[var(--color-error)]",
  };

  const statusLabel: Record<string, string> = {
    healthy: "Opérationnel",
    degraded: "Dégradé",
    down: "Hors service",
  };

  return (
    <motion.div
      variants={cardVariants}
      className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-hover)]">
        <Server className="h-4 w-4 text-[var(--color-text-secondary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {provider.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {provider.description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {statusLabel[provider.status]}
        </span>
        <div
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            statusDot[provider.status]
          )}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Emails Page ────────────────────────────────────
export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        page,
        per_page: perPage,
      };

      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await api.getEmails(params);

      if (response.success && response.data) {
        const data = response.data as Record<string, unknown>;
        setEmails(Array.isArray(data.emails) ? data.emails as unknown as Email[] : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les emails"
      );
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  function handleTypeChange(value: string) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function toggleEmailExpand(emailId: string) {
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Emails
          </h1>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
            {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="flex items-center gap-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={cn("h-4 w-4", loading && "animate-spin")}
            />
            Actualiser
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-fg)] rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nouveau message
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-elevated p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="appearance-none bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] pl-3 pr-9 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)] cursor-pointer"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] pl-3 pr-9 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
          </div>

          {/* Clear filters */}
          {(typeFilter || statusFilter) && (
            <button
              onClick={() => {
                setTypeFilter("");
                setStatusFilter("");
                setPage(1);
              }}
              className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="h-3 w-3" />
              Réinitialiser
            </button>
          )}

          {/* Summary */}
          <div className="sm:ml-auto">
            <p className="text-xs text-[var(--color-text-muted)]">
              {total} email{total > 1 ? "s" : ""}
              {typeFilter && ` — ${TYPE_OPTIONS.find((o) => o.value === typeFilter)?.label}`}
              {statusFilter && ` — ${STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}`}
            </p>
          </div>
        </div>
      </div>

      {/* Email List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <EmailCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Erreur de chargement"
          description={error}
          action={{ label: "Réessayer", onClick: fetchEmails }}
        />
      ) : emails.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucun email"
          description={
            typeFilter || statusFilter
              ? "Aucun email ne correspond à vos filtres. Essayez de modifier vos critères."
              : "Aucun email envoyé pour le moment. Les emails envoyés apparaîtront ici."
          }
          action={
            typeFilter || statusFilter
              ? {
                  label: "Réinitialiser les filtres",
                  onClick: () => {
                    setTypeFilter("");
                    setStatusFilter("");
                    setPage(1);
                  },
                }
              : {
                  label: "Envoyer un email",
                  onClick: () => setShowCompose(true),
                }
          }
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              expanded={expandedEmail === email.id}
              onToggle={() => toggleEmailExpand(email.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            Page {page} sur {totalPages} — {total} email
            {total > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => {
                const start = Math.max(
                  1,
                  Math.min(page - 2, totalPages - 4)
                );
                return start + i;
              }
            )
              .filter((p) => p >= 1 && p <= totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "h-7 w-7 rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
                    p === page
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
                  )}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Provider Health Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Fournisseurs d&apos;emails
            </h2>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
              État des services d&apos;envoi
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {PROVIDER_STATUS.map((provider) => (
            <ProviderCard key={provider.name} provider={provider} />
          ))}
        </motion.div>
      </motion.div>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(false)}
            onSent={fetchEmails}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

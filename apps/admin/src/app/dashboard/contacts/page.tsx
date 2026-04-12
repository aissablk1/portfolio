"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Send,
  CheckCircle,
  AlertTriangle,
  Archive,
  Trash2,
  Reply,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api-client";
import {
  cn,
  formatDateTime,
  formatRelativeTime,
  truncate,
  getInitials,
} from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loading";
import type { Contact } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "processed", label: "Traités" },
  { value: "spam", label: "Spam" },
  { value: "error", label: "Erreur" },
  { value: "archived", label: "Archivés" },
];

const PER_PAGE = 20;

// ─── Reply form schema ──────────────────────────────────
const replySchema = z.object({
  message: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(5000, "Le message est trop long (5000 caractères max)"),
});

type ReplyFormData = z.infer<typeof replySchema>;

// ─── Animation variants ─────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const panelVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

// ─── Contact Detail Panel ────────────────────────────────
function ContactDetailPanel({
  contact,
  onClose,
  onUpdate,
}: {
  contact: Contact;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const contactId = contact.id ?? contact._id ?? "";

  async function handleAction(
    action: string,
    fn: () => Promise<unknown>,
    successMessage: string
  ) {
    try {
      setActionLoading(action);
      await fn();
      toast.success(successMessage);
      onUpdate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function onReplySubmit(data: ReplyFormData) {
    try {
      await api.replyToContact(contactId, data.message);
      toast.success("Réponse envoyée avec succès");
      reset();
      setShowReply(false);
      onUpdate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'envoyer la réponse"
      );
    }
  }

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] shadow-2xl overflow-y-auto"
    >
      {/* Panel Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-medium text-[var(--color-accent)]">
            {getInitials(contact.name)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {contact.name}
            </h3>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {contact.email}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3">
          <StatusBadge status={contact.status} />
          <span className="text-xs text-[var(--color-text-muted)]">
            {formatRelativeTime(contact.timestamp)}
          </span>
          {contact.replied && (
            <span className="text-xs text-[var(--color-success)] flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Répondu
            </span>
          )}
        </div>

        {/* Subject & Message */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Sujet
            </label>
            <p className="mt-1 text-sm text-[var(--color-text-primary)]">
              {contact.subject}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Message
            </label>
            <div className="mt-1 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-4">
              <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] p-4 space-y-2">
          <h4 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
            Métadonnées
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[var(--color-text-muted)]">Date</span>
              <p className="text-[var(--color-text-secondary)] mt-0.5">
                {formatDateTime(contact.timestamp)}
              </p>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)]">
                Adresse IP
              </span>
              <p className="text-[var(--color-text-secondary)] mt-0.5 font-mono">
                {contact.ip_address ?? "Non disponible (N/A)"}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-[var(--color-text-muted)]">
                User Agent
              </span>
              <p className="text-[var(--color-text-secondary)] mt-0.5 font-mono text-[11px] break-all">
                {contact.user_agent ?? "Non disponible (N/A)"}
              </p>
            </div>
            {contact.email_sent !== undefined && (
              <div>
                <span className="text-[var(--color-text-muted)]">
                  Email envoyé
                </span>
                <p className="text-[var(--color-text-secondary)] mt-0.5">
                  {contact.email_sent ? "Oui" : "Non"}
                </p>
              </div>
            )}
            {contact.auto_reply_sent !== undefined && (
              <div>
                <span className="text-[var(--color-text-muted)]">
                  Réponse auto
                </span>
                <p className="text-[var(--color-text-secondary)] mt-0.5">
                  {contact.auto_reply_sent ? "Oui" : "Non"}
                </p>
              </div>
            )}
            {contact.processed_at && (
              <div>
                <span className="text-[var(--color-text-muted)]">
                  Traité le
                </span>
                <p className="text-[var(--color-text-secondary)] mt-0.5">
                  {formatDateTime(contact.processed_at)}
                </p>
              </div>
            )}
            {contact.error_message && (
              <div className="col-span-2">
                <span className="text-[var(--color-error)]">Erreur</span>
                <p className="text-[var(--color-text-secondary)] mt-0.5">
                  {contact.error_message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {contact.notes && (
          <div>
            <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Notes
            </label>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">
              {contact.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
            Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-fg)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Reply className="h-4 w-4" />
              Répondre
            </button>
            <button
              onClick={() =>
                handleAction(
                  "processed",
                  () =>
                    api.updateContact(contactId, { status: "processed" }),
                  "Contact marqué comme traité"
                )
              }
              disabled={
                actionLoading === "processed" ||
                contact.status === "processed"
              }
              className="flex items-center justify-center gap-2 bg-[var(--color-success-soft)] text-[var(--color-success)] hover:bg-[var(--color-success)]/20 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading === "processed" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Traité
            </button>
            <button
              onClick={() =>
                handleAction(
                  "spam",
                  () => api.updateContact(contactId, { status: "spam" }),
                  "Contact marqué comme spam"
                )
              }
              disabled={
                actionLoading === "spam" || contact.status === "spam"
              }
              className="flex items-center justify-center gap-2 bg-[var(--color-warning-soft)] text-[var(--color-warning)] hover:bg-[var(--color-warning)]/20 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading === "spam" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              Spam
            </button>
            <button
              onClick={() =>
                handleAction(
                  "archived",
                  () =>
                    api.updateContact(contactId, { status: "archived" }),
                  "Contact archivé"
                )
              }
              disabled={
                actionLoading === "archived" ||
                contact.status === "archived"
              }
              className="flex items-center justify-center gap-2 bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-active)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {actionLoading === "archived" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Archive className="h-4 w-4" />
              )}
              Archiver
            </button>
          </div>
          <button
            onClick={() =>
              handleAction(
                "delete",
                () => api.deleteContact(contactId),
                "Contact supprimé"
              )
            }
            disabled={actionLoading === "delete"}
            className="flex w-full items-center justify-center gap-2 bg-[var(--color-error-soft)] text-[var(--color-error)] hover:bg-[var(--color-error)]/20 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {actionLoading === "delete" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Supprimer
          </button>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReply && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onReplySubmit)}
              className="space-y-3 overflow-hidden"
            >
              <h4 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Répondre à {contact.name}
              </h4>
              <textarea
                {...register("message")}
                placeholder="Votre réponse..."
                rows={5}
                className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)] resize-none"
              />
              {errors.message && (
                <p className="text-xs text-[var(--color-error)]">
                  {errors.message.message}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-fg)] rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReply(false);
                    reset();
                  }}
                  className="bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-4 py-2 text-sm transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Sort Icon ───────────────────────────────────────────
function SortIcon({
  column,
  currentSort,
  currentOrder,
}: {
  column: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
}) {
  if (currentSort !== column) {
    return <ArrowUpDown className="h-3 w-3 text-[var(--color-text-muted)]" />;
  }
  return currentOrder === "asc" ? (
    <ArrowUp className="h-3 w-3 text-[var(--color-accent)]" />
  ) : (
    <ArrowDown className="h-3 w-3 text-[var(--color-accent)]" />
  );
}

// ─── Main Contacts Page ──────────────────────────────────
export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = {
        page,
        per_page: PER_PAGE,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const response = await api.getContacts(params);

      if (response.success && response.data) {
        const data = response.data as Record<string, unknown>;
        setContacts(Array.isArray(data.contacts) ? data.contacts as unknown as Contact[] : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
        setTotalPages(typeof data.total_pages === "number" ? data.total_pages : 0);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les contacts"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, dateFrom, dateTo, sortBy, sortOrder]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  }

  async function handleExport(format: "csv" | "json") {
    try {
      setExportLoading(format);
      const blob = await api.exportContacts(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Export ${format.toUpperCase()} téléchargé`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de l'export"
      );
    } finally {
      setExportLoading(null);
    }
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleDateChange(type: "from" | "to", value: string) {
    if (type === "from") setDateFrom(value);
    else setDateTo(value);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  const hasActiveFilters = search || statusFilter || dateFrom || dateTo;

  // Pagination range
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Contacts
          </h1>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
            {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            disabled={exportLoading === "csv"}
            className="flex items-center gap-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors disabled:opacity-50"
          >
            {exportLoading === "csv" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            CSV
          </button>
          <button
            onClick={() => handleExport("json")}
            disabled={exportLoading === "json"}
            className="flex items-center gap-2 bg-[var(--color-bg-hover)] hover:bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors disabled:opacity-50"
          >
            {exportLoading === "json" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            JSON
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-elevated p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher par nom, email ou sujet..."
              className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] pl-10 pr-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
            />
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

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
              showFilters || hasActiveFilters
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-active)]"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] text-[var(--color-accent-fg)]">
                !
              </span>
            )}
          </button>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 pt-3 border-t border-[var(--color-border)] sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) =>
                      handleDateChange("from", e.target.value)
                    }
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                    placeholder="Du"
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    au
                  </span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) =>
                      handleDateChange("to", e.target.value)
                    }
                    className="bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]"
                    placeholder="Au"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Réinitialiser
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Erreur de chargement"
          description={error}
          action={{ label: "Réessayer", onClick: fetchContacts }}
        />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun contact trouvé"
          description={
            hasActiveFilters
              ? "Aucun contact ne correspond à vos filtres. Essayez de modifier vos critères de recherche."
              : "Aucun contact pour le moment. Les soumissions du formulaire de contact apparaîtront ici."
          }
          action={
            hasActiveFilters
              ? { label: "Réinitialiser les filtres", onClick: clearFilters }
              : undefined
          }
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {[
                    { key: "name", label: "Nom" },
                    { key: "email", label: "Email" },
                    { key: "subject", label: "Sujet" },
                    { key: "status", label: "Statut" },
                    { key: "timestamp", label: "Date" },
                    { key: "", label: "" },
                  ].map((col) => (
                    <th
                      key={col.key || "actions"}
                      className={cn(
                        "px-5 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider",
                        col.key && "cursor-pointer select-none hover:text-[var(--color-text-secondary)] transition-colors"
                      )}
                      onClick={() => col.key && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.key && (
                          <SortIcon
                            column={col.key}
                            currentSort={sortBy}
                            currentOrder={sortOrder}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <motion.tr
                    key={contact.id ?? contact._id}
                    variants={rowVariants}
                    onClick={() => setSelectedContact(contact)}
                    className="border-b border-[var(--color-border-light)] cursor-pointer transition-colors hover:bg-[var(--color-bg-hover)]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-medium text-[var(--color-accent)]">
                          {getInitials(contact.name)}
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[140px]">
                          {contact.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--color-text-secondary)] truncate block max-w-[180px]">
                        {contact.email}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--color-text-secondary)] truncate block max-w-[200px]">
                        {truncate(contact.subject, 40)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                        {formatRelativeTime(contact.timestamp)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3">
              <p className="text-xs text-[var(--color-text-muted)]">
                Page {page} sur {totalPages} — {total} contact
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
                {paginationRange.map((p) => (
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
        </motion.div>
      )}

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <ContactDetailPanel
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onUpdate={() => {
                fetchContacts();
                setSelectedContact(null);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

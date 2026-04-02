"use client";

import { cn, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  processed: "Traite",
  spam: "Spam",
  error: "Erreur",
  archived: "Archive",
  sent: "Envoye",
  delivered: "Délivré",
  failed: "Échoué",
  bounced: "Rejeté",
  healthy: "Fonctionnel",
  degraded: "Dégradé",
  down: "Hors service",
  success: "Succès",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const displayLabel = label ?? statusLabels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {displayLabel}
    </span>
  );
}

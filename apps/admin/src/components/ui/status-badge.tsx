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
  delivered: "Delivre",
  failed: "Echoue",
  bounced: "Rejete",
  healthy: "Fonctionnel",
  degraded: "Degrade",
  down: "Hors service",
  success: "Succes",
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

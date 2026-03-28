"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Page Loader ────────────────────────────────────── */

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
        <p className="text-xs text-[var(--color-text-muted)]">
          Chargement...
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Card Skeleton ──────────────────────────────────── */

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 4, className }: CardSkeletonProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card-elevated animate-pulse p-5"
        >
          <div className="flex items-start justify-between">
            <div className="h-9 w-9 rounded-[var(--radius-md)] bg-[var(--color-bg-hover)]" />
            <div className="h-4 w-10 rounded bg-[var(--color-bg-hover)]" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-7 w-20 rounded bg-[var(--color-bg-hover)]" />
            <div className="h-3 w-28 rounded bg-[var(--color-bg-hover)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Table Skeleton ─────────────────────────────────── */

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("card-elevated overflow-hidden", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-[var(--color-border)] px-5 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`head-${i}`}
            className="h-3 flex-1 rounded bg-[var(--color-bg-hover)]"
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex animate-pulse gap-4 border-b border-[var(--color-border-light)] px-5 py-4 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                "h-3 flex-1 rounded bg-[var(--color-bg-hover)]",
                colIndex === 0 && "max-w-[140px]",
                colIndex === columns - 1 && "max-w-[80px]"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

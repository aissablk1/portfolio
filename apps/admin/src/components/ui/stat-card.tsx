"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label?: string;
  };
  index?: number;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  index = 0,
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "card-elevated p-5 transition-colors hover:border-[var(--color-glass-border)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)]">
          <Icon className="h-4 w-4 text-[var(--color-accent)]" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              isPositive
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
          {label}
        </p>
      </div>

      {trend?.label && (
        <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
          {trend.label}
        </p>
      )}
    </motion.div>
  );
}

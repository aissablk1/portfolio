"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn, getInitials, formatDate } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const pageTitles: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/contacts": "Contacts",
  "/dashboard/emails": "Emails",
  "/dashboard/analytics": "Analytique",
  "/dashboard/notifications": "Notifications",
  "/dashboard/security": "Securite",
  "/dashboard/site": "Site",
  "/dashboard/settings": "Parametres",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = useMemo(() => {
    // Correspondance exacte d'abord
    if (pageTitles[pathname]) return pageTitles[pathname];

    // Correspondance partielle pour les sous-routes
    const match = Object.entries(pageTitles).find(
      ([path]) => path !== "/dashboard" && pathname.startsWith(path)
    );
    return match ? match[1] : "Dashboard";
  }, [pathname]);

  const currentDate = formatDate(new Date(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary)]/80 px-6 backdrop-blur-xl lg:px-8">
      {/* Titre de la page */}
      <motion.h1
        key={pathname}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-lg font-semibold text-[var(--color-text-primary)] pl-12 lg:pl-0"
      >
        {title}
      </motion.h1>

      {/* Droite : date, notifications, avatar */}
      <div className="flex items-center gap-4">
        {/* Date courante */}
        <span className="hidden text-xs text-[var(--color-text-tertiary)] capitalize md:block">
          {currentDate}
        </span>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-[var(--radius-md)] p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
        </motion.button>

        {/* Avatar */}
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
          "bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20"
        )}>
          {user ? getInitials(user.username) : "—"}
        </div>
      </div>
    </header>
  );
}

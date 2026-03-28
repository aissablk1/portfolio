"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "L'identifiant est requis"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    setIsSubmitting(true);

    try {
      await login(data.username, data.password);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur de connexion inattendue";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Fond subtil avec gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      {/* Carte de login */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] px-4"
      >
        <div className="glass rounded-[var(--radius-xl)] p-8 shadow-2xl shadow-black/20">
          {/* En-tete */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] ring-1 ring-[var(--color-accent)]/20"
            >
              <Lock className="h-6 w-6 text-[var(--color-accent)]" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                AISSA BELKOUSSA
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                Administration
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Identifiant */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-[var(--color-text-secondary)]"
              >
                Identifiant
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                {...register("username")}
                className={cn(
                  "w-full rounded-[var(--radius-md)] border bg-[var(--color-bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors",
                  "focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]/30",
                  errors.username
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-border)]"
                )}
                placeholder="Votre identifiant"
              />
              {errors.username && (
                <p className="text-xs text-[var(--color-error)]">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[var(--color-text-secondary)]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "w-full rounded-[var(--radius-md)] border bg-[var(--color-bg-secondary)] px-3.5 py-2.5 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors",
                    "focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]/30",
                    errors.password
                      ? "border-[var(--color-error)]"
                      : "border-[var(--color-border)]"
                  )}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[var(--color-error)]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton Connexion */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-medium transition-colors",
                "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Connexion"
              )}
            </motion.button>
          </form>

          {/* Message d'erreur */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <motion.div
                  animate={{ x: [0, -4, 4, -4, 4, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-error)]/20 bg-[var(--color-error-soft)] px-3 py-2.5"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-[var(--color-error)]" />
                  <p className="text-xs text-[var(--color-error)]">{error}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ligne decorative en bas */}
        <div className="mt-8 flex items-center justify-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <p className="mx-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Acces restreint
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>
      </motion.div>
    </div>
  );
}

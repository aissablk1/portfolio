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
  username: z.string().min(1, "L'identifiant est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
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
          : "Identifiants incorrects";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Grille subtile en fond — comme le portfolio */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Carte de login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* En-tête */}
        <div className="mb-12 flex flex-col items-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring" as const,
              stiffness: 200,
              damping: 15,
            }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] border border-[var(--color-border)]"
          >
            <Lock className="h-5 w-5 text-[var(--color-text-primary)]" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-medium tracking-tight text-[var(--color-text-primary)]">
              AÏSSA BELKOUSSA
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
              Administration
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Identifiant */}
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] mb-3"
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
                "w-full bg-transparent border-b py-3 text-lg font-[var(--font-display)] outline-none transition-colors",
                "placeholder:text-[var(--color-text-muted)]",
                errors.username
                  ? "border-[var(--color-error)]"
                  : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
              )}
              placeholder="Votre identifiant"
            />
            {errors.username && (
              <p className="mt-1.5 text-xs text-[var(--color-error)]">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-secondary)] mb-3"
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
                  "w-full bg-transparent border-b py-3 pr-10 text-lg outline-none transition-colors",
                  "placeholder:text-[var(--color-text-muted)]",
                  errors.password
                    ? "border-[var(--color-error)]"
                    : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                )}
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
                tabIndex={-1}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-[var(--color-error)]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Bouton Connexion — Style portfolio (noir, rounded-full) */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all",
              "bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-lg shadow-[var(--color-accent)]/20",
              "hover:shadow-xl hover:shadow-[var(--color-accent)]/25",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion...
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
              className="mt-6"
            >
              <motion.div
                animate={{ x: [0, -4, 4, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--color-error)]/15 bg-[var(--color-error-soft)] px-4 py-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-[var(--color-error)]" />
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ligne décorative — style portfolio */}
        <div className="mt-12 flex items-center justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <p className="mx-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            Accès restreint
          </p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>
      </motion.div>
    </div>
  );
}

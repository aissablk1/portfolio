"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDateTime } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { AppSettings } from "@/lib/types";
import {
  User,
  Mail,
  Bell,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  HardDrive,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Send,
  MessageCircle,
  BookOpen,
  Table2,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// ─── Schemas ─────────────────────────────────────────
const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Mot de passe actuel requis"),
    new_password: z.string().min(8, "Minimum 8 caractères"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const emailConfigSchema = z.object({
  provider: z.string(),
  smtp_server: z.string().optional(),
  smtp_port: z.number().optional(),
  from_email: z.string().email("Email invalide"),
  auto_reply_enabled: z.boolean(),
});

type EmailConfigData = z.infer<typeof emailConfigSchema>;

// ─── Section Header ──────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)]">
        <Icon className="h-5 w-5 text-[var(--color-accent)]" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>
      </div>
    </div>
  );
}

// ─── Toggle ──────────────────────────────────────────
function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        enabled ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg-hover)]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

// ─── Input Field ─────────────────────────────────────
function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  masked,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  masked?: boolean;
}) {
  const [showValue, setShowValue] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <input
          type={masked && !showValue ? "password" : type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors",
            readOnly && "opacity-60 cursor-not-allowed",
            masked && "pr-10"
          )}
        />
        {masked && (
          <button
            type="button"
            onClick={() => setShowValue(!showValue)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [adminEmail, setAdminEmail] = useState("");

  // Profile
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sigle, setSigle] = useState("");

  // Email config
  const [emailProvider, setEmailProvider] = useState("smtp");
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [fromEmail, setFromEmail] = useState("");
  const [autoReply, setAutoReply] = useState(false);

  // Notifications
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [notionEnabled, setNotionEnabled] = useState(false);
  const [sheetsEnabled, setSheetsEnabled] = useState(false);

  // Security
  const [rateLimit, setRateLimit] = useState(60);
  const [spamThreshold, setSpamThreshold] = useState(0.5);
  const [autoBlacklist, setAutoBlacklist] = useState(false);

  // Saving
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Backup
  const [backingUp, setBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Danger
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // ─── Load data ──────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSettings();
      if (res.data) {
        const raw = res.data as Record<string, unknown>;
        const s: AppSettings & {
          admin_email?: string;
          last_backup?: string;
          backup_url?: string;
        } = raw as unknown as AppSettings & {
          admin_email?: string;
          last_backup?: string;
          backup_url?: string;
        };
        setSettings(s);

        // Email (defensive: s.email may be undefined)
        const email = (raw.email ?? {}) as Record<string, unknown>;
        setEmailProvider(typeof email.provider === "string" ? email.provider : "smtp");
        setSmtpServer(typeof email.smtp_server === "string" ? email.smtp_server : "");
        setSmtpPort(typeof email.smtp_port === "number" ? email.smtp_port : 587);
        setFromEmail(typeof email.from_email === "string" ? email.from_email : "");
        setAutoReply(typeof email.auto_reply_enabled === "boolean" ? email.auto_reply_enabled : false);

        // Notifications (defensive: s.notifications may be undefined)
        const notif = (raw.notifications ?? {}) as Record<string, unknown>;
        setTelegramEnabled(!!notif.telegram_enabled);
        setWhatsappEnabled(!!notif.whatsapp_enabled);
        setNotionEnabled(!!notif.notion_enabled);
        setSheetsEnabled(!!notif.google_sheets_enabled);

        // Security (defensive: s.security may be undefined)
        const security = (raw.security ?? {}) as Record<string, unknown>;
        setRateLimit(typeof security.rate_limit_per_hour === "number" ? security.rate_limit_per_hour : 60);
        setSpamThreshold(typeof security.spam_threshold === "number" ? security.spam_threshold : 0.5);
        setAutoBlacklist(typeof security.auto_blacklist === "boolean" ? security.auto_blacklist : false);

        // Admin
        setAdminEmail(typeof raw.admin_email === "string" ? raw.admin_email : (user?.email ?? ""));

        // Profile from auth user
        setDisplayName(user?.display_name ?? "");
        setAvatarUrl(user?.avatar_url ?? "");
        setSigle(user?.sigle ?? "");

        // Backup
        setLastBackup(typeof raw.last_backup === "string" ? raw.last_backup : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.display_name, user?.avatar_url, user?.sigle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Save section ───────────────────────────────
  const saveSection = async (section: string, data: Record<string, unknown>) => {
    setSavingSection(section);
    try {
      await api.updateSettings(data);
      toast.success("Paramètres enregistrés");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSavingSection(null);
    }
  };

  // ─── Save profile ───────────────────────────────
  const handleSaveProfile = async () => {
    setSavingSection("profile");
    try {
      await api.updateProfile({
        display_name: displayName,
        avatar_url: avatarUrl,
        sigle,
      });
      // Also save admin email via settings
      if (adminEmail) {
        await api.updateSettings({ admin_email: adminEmail });
      }
      toast.success("Profil enregistré");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde du profil");
    } finally {
      setSavingSection(null);
    }
  };

  // ─── Save email config ──────────────────────────
  const handleSaveEmail = () =>
    saveSection("email", {
      email: {
        provider: emailProvider,
        smtp_server: smtpServer,
        smtp_port: smtpPort,
        from_email: fromEmail,
        auto_reply_enabled: autoReply,
      },
    });

  // ─── Save notifications ─────────────────────────
  const handleSaveNotifications = () =>
    saveSection("notifications", {
      notifications: {
        telegram_enabled: telegramEnabled,
        whatsapp_enabled: whatsappEnabled,
        notion_enabled: notionEnabled,
        google_sheets_enabled: sheetsEnabled,
      },
    });

  // ─── Save security ─────────────────────────────
  const handleSaveSecurity = () =>
    saveSection("security", {
      security: {
        rate_limit_per_hour: rateLimit,
        spam_threshold: spamThreshold,
        auto_blacklist: autoBlacklist,
      },
    });

  // ─── Change password ────────────────────────────
  const handleChangePassword = async (data: PasswordFormData) => {
    setSavingSection("password");
    try {
      await api.updateSettings({
        password: {
          current: data.current_password,
          new: data.new_password,
        },
      });
      toast.success("Mot de passe modifié");
      passwordForm.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSavingSection(null);
    }
  };

  // ─── Backup ─────────────────────────────────────
  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const res = await api.triggerBackup();
      if (res.success && res.blob) {
        // Trigger browser download
        const url = URL.createObjectURL(res.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setLastBackup(new Date().toISOString());
        toast.success("Backup créé et téléchargé avec succès");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du backup");
    } finally {
      setBackingUp(false);
    }
  };

  // ─── Reset settings ────────────────────────────
  const handleResetSettings = async () => {
    setSavingSection("reset");
    try {
      await api.updateSettings({ reset: true });
      toast.success("Paramètres réinitialisés");
      setShowResetConfirm(false);
      loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSavingSection(null);
    }
  };

  // ─── Loading state ──────────────────────────────
  if (loading && !settings) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
        <p className="text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={loadData}
          className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Paramètres</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Configuration de l&apos;application et du compte
        </p>
      </motion.div>

      {/* Admin Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <SectionHeader icon={User} title="Profil admin" description="Informations du compte administrateur" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Nom d'utilisateur"
              value={user?.username ?? ""}
              readOnly
            />
            <InputField
              label="Email"
              type="email"
              value={adminEmail}
              onChange={setAdminEmail}
              placeholder="admin@example.com"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              label="Nom d'affichage"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Aïssa BELKOUSSA"
            />
            <InputField
              label="URL de l'avatar"
              value={avatarUrl}
              onChange={setAvatarUrl}
              placeholder="https://example.com/avatar.jpg"
            />
            <InputField
              label="Sigle"
              value={sigle}
              onChange={setSigle}
              placeholder="AB"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingSection === "profile"}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {savingSection === "profile" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer le profil
          </button>
        </div>

        {/* Password change */}
        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--color-text-tertiary)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Changer le mot de passe
            </h3>
          </div>
          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="space-y-3"
          >
            <input type="text" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Mot de passe actuel
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  autoComplete="current-password"
                  {...passwordForm.register("current_password")}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                />
                {passwordForm.formState.errors.current_password && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">
                    {passwordForm.formState.errors.current_password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Nouveau mot de passe
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  autoComplete="new-password"
                  {...passwordForm.register("new_password")}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                />
                {passwordForm.formState.errors.new_password && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">
                    {passwordForm.formState.errors.new_password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Confirmer
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  autoComplete="new-password"
                  {...passwordForm.register("confirm_password")}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                />
                {passwordForm.formState.errors.confirm_password && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">
                    {passwordForm.formState.errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={savingSection === "password"}
                className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              >
                {savingSection === "password" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Modifier le mot de passe
              </button>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                {showPasswords ? "Masquer" : "Afficher"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Email Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <SectionHeader icon={Mail} title="Configuration email" description="Fournisseur et paramètres d'envoi" />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              Fournisseur
            </label>
            <div className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1 w-fit">
              {["smtp", "resend", "formsubmit"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEmailProvider(p)}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                    emailProvider === p
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {p === "formsubmit" ? "FormSubmit" : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {emailProvider === "smtp" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Serveur SMTP"
                value={smtpServer}
                onChange={setSmtpServer}
                placeholder="smtp.example.com"
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
                  Port
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(parseInt(e.target.value) || 587)}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <InputField
            label="Email d'envoi"
            type="email"
            value={fromEmail}
            onChange={setFromEmail}
            placeholder="noreply@aissabelkoussa.com"
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Réponse automatique</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Envoyer une confirmation automatique aux contacts
              </p>
            </div>
            <Toggle enabled={autoReply} onChange={setAutoReply} />
          </div>

          <button
            onClick={handleSaveEmail}
            disabled={savingSection === "email"}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {savingSection === "email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer l&apos;email
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <SectionHeader icon={Bell} title="Notifications" description="Canaux de notification actifs" />
        <div className="space-y-4">
          {[
            {
              label: "Telegram",
              icon: Send,
              enabled: telegramEnabled,
              onChange: setTelegramEnabled,
              color: "text-[#26A5E4]",
            },
            {
              label: "WhatsApp",
              icon: MessageCircle,
              enabled: whatsappEnabled,
              onChange: setWhatsappEnabled,
              color: "text-[#25D366]",
            },
            {
              label: "Notion",
              icon: BookOpen,
              enabled: notionEnabled,
              onChange: setNotionEnabled,
              color: "text-[var(--color-text-primary)]",
            },
            {
              label: "Google Sheets",
              icon: Table2,
              enabled: sheetsEnabled,
              onChange: setSheetsEnabled,
              color: "text-[#34A853]",
            },
          ].map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.label}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5", ch.color)} />
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {ch.label}
                  </span>
                </div>
                <Toggle enabled={ch.enabled} onChange={ch.onChange} />
              </div>
            );
          })}

          <button
            onClick={handleSaveNotifications}
            disabled={savingSection === "notifications"}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {savingSection === "notifications" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer les notifications
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <SectionHeader icon={Shield} title="Sécurité" description="Limites de taux et detection du spam" />
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              Limite de taux par heure
            </label>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value) || 60)}
              min={1}
              max={1000}
              className="w-32 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                Seuil de detection du spam
              </label>
              <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
                {spamThreshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              value={spamThreshold}
              onChange={(e) => setSpamThreshold(parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.05}
              className="w-full accent-[var(--color-accent)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>Strict (0)</span>
              <span>Permissif (1)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">Auto-blacklist</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Bloquer automatiquement les IPs avec un score de spam élevé
              </p>
            </div>
            <Toggle enabled={autoBlacklist} onChange={setAutoBlacklist} />
          </div>

          <button
            onClick={handleSaveSecurity}
            disabled={savingSection === "security"}
            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {savingSection === "security" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer la sécurité
          </button>
        </div>
      </motion.div>

      {/* Backup */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-glass-border)] bg-[var(--color-glass)] p-6 backdrop-blur-xl"
      >
        <SectionHeader icon={HardDrive} title="Sauvegarde" description="Backups de la base de données" />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleBackup}
              disabled={backingUp}
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
            >
              {backingUp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <HardDrive className="h-4 w-4" />
              )}
              Creer un backup
            </button>
            {/* Le backup se télécharge automatiquement */}
          </div>
          {lastBackup && (
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Dernier backup : {formatDateTime(lastBackup)}
            </p>
          )}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-[var(--radius-lg)] border border-[var(--color-error)]/30 bg-[var(--color-error-soft)] p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
          <h2 className="text-lg font-semibold text-[var(--color-error)]">Zone dangereuse</h2>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Réinitialiser les paramètres
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Restaurer tous les paramètres à leurs valeurs par défaut
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="shrink-0 rounded-[var(--radius-md)] border border-[var(--color-error)]/50 px-4 py-2 text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-accent-fg)] transition-colors"
            >
              Reinitialiser
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                Vider le cache
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Supprimer toutes les données en cache
              </p>
            </div>
            <button
              onClick={async () => {
                toast.info("Vidage du cache...");
                try {
                  await api.updateSettings({ clear_cache: true });
                  toast.success("Cache vidé avec succès");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Erreur");
                }
              }}
              className="shrink-0 rounded-[var(--radius-md)] border border-[var(--color-error)]/50 px-4 py-2 text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-[var(--color-accent-fg)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Vider le cache
              </span>
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-error-soft)]">
                    <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Confirmer la reinitialisation
                  </h3>
                </div>
                <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
                  Cette action va reinitialiser tous les paramètres à leurs valeurs par défaut.
                  Cette operation est irreversible.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleResetSettings}
                    disabled={savingSection === "reset"}
                    className="rounded-[var(--radius-md)] bg-[var(--color-error)] px-4 py-2 text-sm font-medium text-[var(--color-accent-fg)] hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {savingSection === "reset" ? (
                      <Loader2 className="inline h-4 w-4 animate-spin" />
                    ) : (
                      "Reinitialiser"
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

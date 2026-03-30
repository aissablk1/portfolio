"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, ApiError } from "@/lib/api-client";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  sigle?: string;
  last_login?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurer la session au montage
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await api.getMe();
        if (!cancelled && response.data?.user) {
          setUser(response.data.user);
        }
      } catch {
        // Pas de session active, rester non-authentifié
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.login(username, password);
    if (response.data?.user) {
      setUser(response.data.user);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      // Même si le logout API échoue, on nettoie le state local
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

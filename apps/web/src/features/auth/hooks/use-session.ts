"use client";

/**
 * useSession — read-only access to the current session.
 * Use this in components that just need to display user info or tenant
 * context without triggering sign-in / sign-out.
 */
import { useEffect, useState } from "react";
import { authService } from "../services/auth-service";
import type { Session } from "../types/auth.types";

interface UseSessionResult {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<Session | null>;
}

export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await authService.getSession();
      setSession(next);
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load session";
      setError(message);
      setSession(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { session, isLoading, error, refresh };
}

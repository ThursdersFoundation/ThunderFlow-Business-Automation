"use client";

/**
 * useAuth — top-level auth state hook.
 * Wraps the session-fetching logic and exposes a stable `signIn` / `signOut`
 * interface for components that don't need fine-grained control.
 */
import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth-service";
import type {
  AuthState,
  LoginCredentials,
  RegisterPayload,
  TwoFactorVerifyPayload,
} from "../types/auth.types";

const initialState: AuthState = {
  status: "loading",
  session: null,
  error: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await authService.getSession();
      if (cancelled) return;
      setState({
        status: session ? "authenticated" : "unauthenticated",
        session,
        error: null,
      });
      if (session?.accessToken) {
        // The session endpoint returns a short-lived token for client use.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.session.accessToken) {
        // Token is set inside the service; no need to duplicate here.
      }
      setState({
        status: "authenticated",
        session: response.session,
        error: null,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setState({ status: "unauthenticated", session: null, error: message });
      throw err;
    }
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const response = await authService.register(payload);
      setState({
        status: "authenticated",
        session: response.session,
        error: null,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setState({ status: "unauthenticated", session: null, error: message });
      throw err;
    }
  }, []);

  const verifyTwoFactor = useCallback(async (payload: TwoFactorVerifyPayload) => {
    setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const response = await authService.verifyTwoFactor(payload);
      setState({
        status: "authenticated",
        session: response.session,
        error: null,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setState({ status: "unauthenticated", session: null, error: message });
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setState({ status: "unauthenticated", session: null, error: null });
  }, []);

  return {
    ...state,
    user: state.session?.user ?? null,
    isAuthenticated: state.status === "authenticated",
    isLoading: state.status === "loading",
    signIn,
    signUp,
    signOut,
    verifyTwoFactor,
  };
}

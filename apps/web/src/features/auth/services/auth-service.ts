/**
 * Auth feature — service layer
 * Thin async wrappers around the auth API endpoints. Used by hooks.
 */
import { apiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
  Session,
  TwoFactorChallenge,
  TwoFactorVerifyPayload,
  User,
} from "../types/auth.types";

const BASE = "/api/auth";

export const authService = {
  async login(payload: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BASE}/login`, payload);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${BASE}/register`, payload);
  },

  async logout(): Promise<void> {
    await apiClient.post(`${BASE}/logout`, {});
    apiClient.setToken(null);
  },

  async getSession(): Promise<Session | null> {
    try {
      return await apiClient.get<Session>(`${BASE}/session`);
    } catch {
      return null;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>(`${BASE}/me`);
    } catch {
      return null;
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ sent: boolean }> {
    return apiClient.post(`${BASE}/forgot-password`, payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ updated: boolean }> {
    return apiClient.post(`${BASE}/reset-password`, payload);
  },

  async startTwoFactor(
    challengeId: string,
  ): Promise<TwoFactorChallenge> {
    return apiClient.post(`${BASE}/two-factor/send`, { challengeId });
  },

  async verifyTwoFactor(payload: TwoFactorVerifyPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${BASE}/two-factor/verify`, payload);
    if (response.session.accessToken) {
      apiClient.setToken(response.session.accessToken);
    }
    return response;
  },

  /** OAuth entry — returns a redirect URL the browser should navigate to. */
  getOAuthUrl(provider: "google" | "github" | "okta", callbackUrl?: string): string {
    const params = new URLSearchParams();
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    return `${BASE}/oauth/${provider}${params.size ? `?${params.toString()}` : ""}`;
  },
};

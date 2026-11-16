/**
 * Auth feature — type definitions
 * Shared between client components, hooks, and the auth service.
 * Mirrors the server-side Prisma models used by NextAuth.js.
 */

export type AuthProvider = "credentials" | "google" | "github" | "okta" | "saml";

export type UserRole = "owner" | "admin" | "editor" | "viewer" | "billing";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  /** ISO timestamp of when the user was created. */
  createdAt: string;
  /** ISO timestamp of the last successful sign-in. */
  lastSignInAt: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface Session {
  user: User;
  /** The tenant / workspace the session is scoped to. */
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: "free" | "starter" | "pro" | "enterprise";
  };
  /** Bearer token used for API calls; null for SSR sessions. */
  accessToken: string | null;
  /** ISO timestamp at which the token expires. */
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  /** When true, persists the session across browser restarts. */
  remember?: boolean;
  /** NextAuth-style callback URL to redirect to after success. */
  callbackUrl?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  /** Workspace slug to provision on signup. Optional for invitations. */
  tenantName?: string;
  /** Pre-validated invitation token from an email link. */
  invitationToken?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  /** Required by the API to prevent mismatched-submit attacks. */
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface TwoFactorChallenge {
  /** Masked identifier for the challenge, safe to display. */
  challengeId: string;
  /** Where the code was sent — used for UI copy. */
  deliveryChannel: "email" | "authenticator";
  /** Seconds until the code expires. */
  expiresIn: number;
}

export interface TwoFactorVerifyPayload {
  challengeId: string;
  code: string;
  /** Trust this device for 30 days — skips future 2FA on this browser. */
  trustDevice?: boolean;
}

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  session: Session | null;
  error: string | null;
}

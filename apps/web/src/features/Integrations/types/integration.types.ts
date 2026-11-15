/**
 * Integrations feature — type definitions
 * External systems ThunderFlow connects to (Slack, HubSpot, Stripe, etc.).
 */

export type IntegrationCategory =
  | "communication"
  | "crm"
  | "payments"
  | "productivity"
  | "database"
  | "developer"
  | "core";

export type IntegrationStatus =
  | "available"
  | "connected"
  | "disconnected"
  | "error"
  | "deprecated";

export type AuthScheme = "oauth2" | "api_key" | "webhook" | "basic" | "none";

export interface IntegrationCapability {
  /** Action ref, e.g. "slack.postMessage". */
  ref: string;
  name: string;
  description: string;
  /** Does this action require elevated scopes? */
  requiresElevatedScope: boolean;
}

export interface IntegrationDescriptor {
  id: string;
  /** Display name, e.g. "Slack". */
  name: string;
  /** Short marketing-style tagline. */
  tagline: string;
  category: IntegrationCategory;
  /** Logo URL (CDN-hosted). */
  logoUrl: string;
  /** lucide-react icon name used as a fallback when logo fails. */
  icon: string;
  authScheme: AuthScheme;
  /** OAuth scopes requested, if applicable. */
  scopes?: string[];
  /** Whether this integration requires admin approval before connecting. */
  requiresAdminApproval: boolean;
  capabilities: IntegrationCapability[];
  /** Docs URL. */
  docsUrl: string;
  /** Whether the integration is generally available. */
  status: IntegrationStatus;
}

export interface IntegrationConnection {
  id: string;
  integrationId: string;
  integrationName: string;
  status: IntegrationStatus;
  /** Account / workspace label, e.g. "Acme Inc Slack". */
  label: string;
  /** When the connection was established. */
  connectedAt: string;
  /** User id who owns the connection. */
  connectedBy: string;
  /** ISO timestamp the access token expires, if applicable. */
  expiresAt: string | null;
  /** Last time the connection was used in a workflow run. */
  lastUsedAt: string | null;
  /** Per-connection config (channel id, default list, etc.). */
  config: Record<string, unknown>;
  /** Whether the connection is shared across the tenant. */
  shared: boolean;
}

export interface IntegrationListResponse {
  catalog: IntegrationDescriptor[];
  connections: IntegrationConnection[];
}

export interface ConnectIntegrationPayload {
  integrationId: string;
  /** OAuth code or API key, depending on the auth scheme. */
  code?: string;
  apiKey?: string;
  label: string;
  /** Initial config values. */
  config?: Record<string, unknown>;
  shared: boolean;
}

export interface UpdateConnectionPayload {
  label?: string;
  config?: Record<string, unknown>;
  shared?: boolean;
}

/**
 * Integrations feature — service layer
 */
import { apiClient } from "@/lib/api-client";
import type {
  ConnectIntegrationPayload,
  IntegrationConnection,
  IntegrationDescriptor,
  IntegrationListResponse,
  UpdateConnectionPayload,
} from "../types/integration.types";

const BASE = "/api/integrations";

export const integrationService = {
  async list(): Promise<IntegrationListResponse> {
    return apiClient.get<IntegrationListResponse>(BASE);
  },

  async getCatalog(): Promise<IntegrationDescriptor[]> {
    return apiClient.get<IntegrationDescriptor[]>(`${BASE}/catalog`);
  },

  async getConnections(): Promise<IntegrationConnection[]> {
    return apiClient.get<IntegrationConnection[]>(`${BASE}/connections`);
  },

  async getDescriptor(id: string): Promise<IntegrationDescriptor> {
    return apiClient.get<IntegrationDescriptor>(`${BASE}/catalog/${id}`);
  },

  async getConnection(id: string): Promise<IntegrationConnection> {
    return apiClient.get<IntegrationConnection>(`${BASE}/connections/${id}`);
  },

  async connect(payload: ConnectIntegrationPayload): Promise<IntegrationConnection> {
    return apiClient.post<IntegrationConnection>(`${BASE}/connections`, payload);
  },

  async update(id: string, payload: UpdateConnectionPayload): Promise<IntegrationConnection> {
    return apiClient.patch<IntegrationConnection>(`${BASE}/connections/${id}`, payload);
  },

  async disconnect(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/connections/${id}`);
  },

  async refresh(id: string): Promise<IntegrationConnection> {
    return apiClient.post<IntegrationConnection>(`${BASE}/connections/${id}/refresh`, {});
  },

  async test(id: string): Promise<{ ok: boolean; message: string; latencyMs: number }> {
    return apiClient.post(`${BASE}/connections/${id}/test`, {});
  },

  /** Returns the OAuth redirect URL the browser should navigate to. */
  getOAuthUrl(
    integrationId: string,
    connectionId?: string,
    scopes?: string[],
    callbackUrl?: string,
  ): string {
    const params = new URLSearchParams();
    if (connectionId) params.set("state", connectionId);
    if (scopes && scopes.length > 0) params.set("scope", scopes.join(" "));
    if (callbackUrl) params.set("callbackUrl", callbackUrl);
    const query = params.toString() ? `?${params.toString()}` : "";
    return `${BASE}/catalog/${integrationId}/oauth${query}`;
  },
};

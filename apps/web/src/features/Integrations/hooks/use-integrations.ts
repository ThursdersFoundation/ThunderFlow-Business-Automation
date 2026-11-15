"use client";

/**
 * useIntegrations — fetch catalog + connections, expose mutations.
 */
import { useCallback, useEffect, useState } from "react";
import { integrationService } from "../services/integration-service";
import type {
  ConnectIntegrationPayload,
  IntegrationConnection,
  IntegrationDescriptor,
  IntegrationListResponse,
  UpdateConnectionPayload,
} from "../types/integration.types";

interface UseIntegrationsResult {
  catalog: IntegrationDescriptor[];
  connections: IntegrationConnection[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  connect: (payload: ConnectIntegrationPayload) => Promise<IntegrationConnection>;
  update: (id: string, payload: UpdateConnectionPayload) => Promise<void>;
  disconnect: (id: string) => Promise<void>;
  test: (id: string) => Promise<{ ok: boolean; message: string }>;
}

export function useIntegrations(): UseIntegrationsResult {
  const [catalog, setCatalog] = useState<IntegrationDescriptor[]>([]);
  const [connections, setConnections] = useState<IntegrationConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result: IntegrationListResponse = await integrationService.list();
      setCatalog(result.catalog);
      setConnections(result.connections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load integrations.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const connect = useCallback(
    async (payload: ConnectIntegrationPayload) => {
      const connection = await integrationService.connect(payload);
      setConnections((prev) => [...prev, connection]);
      return connection;
    },
    [],
  );

  const update = useCallback(async (id: string, payload: UpdateConnectionPayload) => {
    const next = await integrationService.update(id, payload);
    setConnections((prev) => prev.map((c) => (c.id === id ? next : c)));
  }, []);

  const disconnect = useCallback(async (id: string) => {
    await integrationService.disconnect(id);
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const test = useCallback(async (id: string) => {
    const result = await integrationService.test(id);
    return { ok: result.ok, message: result.message };
  }, []);

  return {
    catalog,
    connections,
    isLoading,
    error,
    refetch: fetchAll,
    connect,
    update,
    disconnect,
    test,
  };
}

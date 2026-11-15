"use client";

/**
 * IntegrationConfiguration — manage an existing connection:
 * relabel, edit config, share toggle, test connection, refresh token,
 * and disconnect.
 */
import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { integrationService } from "../services/integration-service";
import type { IntegrationConnection } from "../types/integration.types";

interface IntegrationConfigurationProps {
  connection: IntegrationConnection;
  onUpdated?: (next: IntegrationConnection) => void;
  onDisconnected?: () => void;
  className?: string;
}

export function IntegrationConfiguration({
  connection,
  onUpdated,
  onDisconnected,
  className,
}: IntegrationConfigurationProps) {
  const [label, setLabel] = useState(connection.label);
  const [shared, setShared] = useState(connection.shared);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = label !== connection.label || shared !== connection.shared;

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const next = await integrationService.update(connection.id, { label, shared });
      onUpdated?.(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await integrationService.test(connection.id);
      setTestResult(result);
    } catch (err) {
      setTestResult({ ok: false, message: err instanceof Error ? err.message : "Test failed." });
    } finally {
      setTesting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const next = await integrationService.refresh(connection.id);
      onUpdated?.(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const onDisconnect = async () => {
    setError(null);
    try {
      await integrationService.disconnect(connection.id);
      onDisconnected?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect.");
    }
  };

  return (
    <div className={cn("space-y-5", className)}>
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{connection.integrationName}</h2>
          <p className="text-sm text-muted-foreground">{connection.label}</p>
        </div>
        <Badge variant={connection.status === "connected" ? "default" : "secondary"}>
          {connection.status}
        </Badge>
      </header>

      <dl className="grid grid-cols-2 gap-3 rounded-lg border bg-card p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Connected</dt>
          <dd>{new Date(connection.connectedAt).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Last used</dt>
          <dd>{connection.lastUsedAt ? new Date(connection.lastUsedAt).toLocaleDateString() : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Token expires</dt>
          <dd>{connection.expiresAt ? new Date(connection.expiresAt).toLocaleDateString() : "—"}</dd>
        </div>
      </dl>

      <div className="space-y-4 rounded-lg border bg-card p-4">
        <div className="space-y-1.5">
          <label htmlFor="conn-label" className="text-sm font-medium">
            Label
          </label>
          <Input
            id="conn-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={60}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={shared}
            onChange={(e) => setShared(e.target.checked)}
            className="size-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
          Shared with team
        </label>

        {Object.keys(connection.config).length > 0 ? (
          <details className="rounded-md border bg-muted/30 p-2">
            <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
              Raw config ({Object.keys(connection.config).length} keys)
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-[11px]">
              {JSON.stringify(connection.config, null, 2)}
            </pre>
          </details>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onTest} disabled={testing}>
              {testing ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              Test connection
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
              {refreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh token
            </Button>
          </div>
          <Button onClick={onSave} disabled={saving || !dirty} size="sm">
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </Button>
        </div>

        {testResult ? (
          <div
            role="status"
            className={cn(
              "flex items-center gap-2 rounded-md p-2 text-sm",
              testResult.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {testResult.ok ? (
              <CheckCircle2 className="size-4" aria-hidden />
            ) : (
              <XCircle className="size-4" aria-hidden />
            )}
            {testResult.message}
          </div>
        ) : null}
      </div>

      <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="text-sm text-muted-foreground">
          Disconnecting removes the credentials and breaks every workflow step that uses this
          connection. Existing runs in flight will fail at the next step.
        </p>
        {confirmingDelete ? (
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={onDisconnect}>
              Yes, disconnect
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="destructive" size="sm" onClick={() => setConfirmingDelete(true)}>
            <Trash2 className="size-4" /> Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}

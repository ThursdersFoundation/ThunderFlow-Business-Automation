"use client";

/**
 * IntegrationConnectDialog — modal that walks through connecting an
 * integration. For OAuth it shows the redirect button; for API-key
 * integrations it shows a form. Handles the "callback" UX as well.
 */
import { useEffect, useState } from "react";
import { Loader2, ExternalLink, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { integrationService } from "../services/integration-service";
import type { IntegrationDescriptor } from "../types/integration.types";

interface IntegrationConnectDialogProps {
  integration: IntegrationDescriptor | null;
  open: boolean;
  onClose: () => void;
  onConnected?: () => void;
  className?: string;
}

type Step = "intro" | "api_key" | "redirecting" | "done" | "error";

export function IntegrationConnectDialog({
  integration,
  open,
  onClose,
  onConnected,
  className,
}: IntegrationConnectDialogProps) {
  const [step, setStep] = useState<Step>("intro");
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [shared, setShared] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && integration) {
      setStep(integration.authScheme === "oauth2" ? "intro" : "api_key");
      setLabel(integration.name);
      setApiKey("");
      setShared(true);
      setError(null);
      setSubmitting(false);
    }
  }, [open, integration]);

  if (!integration) return null;

  const handleOAuth = () => {
    setStep("redirecting");
    const url = integrationService.getOAuthUrl(integration.id);
    // Full-page navigation so the OAuth flow can complete on the provider.
    window.location.href = url;
  };

  const handleApiKey = async () => {
    setError(null);
    if (!apiKey.trim()) {
      setError("Enter the API key for this connection.");
      return;
    }
    setSubmitting(true);
    try {
      await integrationService.connect({
        integrationId: integration.id,
        apiKey,
        label,
        shared,
      });
      setStep("done");
      onConnected?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Connect ${integration.name}`}
      description={integration.tagline}
      className={cn("max-w-lg", className)}
    >
      {step === "intro" && integration.authScheme === "oauth2" ? (
        <div className="space-y-4">
          {integration.scopes && integration.scopes.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium">Permissions requested</h3>
              <ul className="mt-2 space-y-1.5">
                {integration.scopes.map((scope) => (
                  <li key={scope} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden />
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{scope}</code>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label htmlFor="integration-label" className="text-sm font-medium">
              Connection label
            </label>
            <Input
              id="integration-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              Used to identify this connection in lists and audit logs.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={shared}
              onChange={(e) => setShared(e.target.checked)}
              className="size-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            Share with my team (recommended)
          </label>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleOAuth}>
              <ExternalLink className="size-4" /> Authorize with {integration.name}
            </Button>
          </div>
        </div>
      ) : null}

      {step === "api_key" ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Paste the API key from your {integration.name} account. ThunderFlow stores it encrypted
            and never displays it again after this step.
          </p>
          <div className="space-y-1.5">
            <label htmlFor="api-key" className="text-sm font-medium">
              API key
            </label>
            <div className="relative">
              <KeyRound
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-9 font-mono"
                placeholder="sk-…"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="api-key-label" className="text-sm font-medium">
              Connection label
            </label>
            <Input
              id="api-key-label"
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
            Share with my team (recommended)
          </label>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApiKey} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Connect
            </Button>
          </div>
        </div>
      ) : null}

      {step === "redirecting" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">
            Redirecting to {integration.name}… if nothing happens, click below.
          </p>
          <Button variant="outline" size="sm" onClick={handleOAuth}>
            Open {integration.name} manually
          </Button>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="inline-flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <p className="text-sm font-medium">Connection established</p>
          <p className="text-xs text-muted-foreground">
            You can now use {integration.name} actions in your workflows.
          </p>
          <Button onClick={onClose}>Done</Button>
        </div>
      ) : null}
    </Modal>
  );
}

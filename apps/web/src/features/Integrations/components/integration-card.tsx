"use client";

/**
 * IntegrationCard — catalog tile showing name, category, capabilities,
 * and a connect / manage action depending on connection state.
 */
import { CheckCircle2, Plug, PlugZap, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  IntegrationConnection,
  IntegrationDescriptor,
  IntegrationStatus,
} from "../types/integration.types";

interface IntegrationCardProps {
  integration: IntegrationDescriptor;
  connection?: IntegrationConnection;
  onConnect: (integration: IntegrationDescriptor) => void;
  onManage: (connection: IntegrationConnection) => void;
  className?: string;
}

const STATUS_LABEL: Record<IntegrationStatus, string> = {
  available: "Available",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  deprecated: "Deprecated",
};

export function IntegrationCard({
  integration,
  connection,
  onConnect,
  onManage,
  className,
}: IntegrationCardProps) {
  const status: IntegrationStatus = connection?.status ?? integration.status;
  const isConnected = status === "connected";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <header className="flex items-start gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
          <Image
            src={integration.logoUrl}
            alt=""
            fill
            sizes="40px"
            className="object-contain p-1"
            // Fallback handled by onError via the icon below.
          />
          <span className="sr-only">{integration.name} logo</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-foreground">{integration.name}</h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">{integration.tagline}</p>
        </div>
        <StatusPill status={status} />
      </header>

      <ul className="mt-3 flex flex-wrap gap-1" aria-label="Capabilities">
        {integration.capabilities.slice(0, 4).map((cap) => (
          <li key={cap.ref}>
            <Badge variant="outline" className="text-[10px]">
              {cap.name}
            </Badge>
          </li>
        ))}
        {integration.capabilities.length > 4 ? (
          <li>
            <Badge variant="outline" className="text-[10px]">
              +{integration.capabilities.length - 4}
            </Badge>
          </li>
        ) : null}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-4">
        <a
          href={integration.docsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
        >
          Docs
        </a>
        {isConnected && connection ? (
          <Button size="sm" variant="outline" onClick={() => onManage(connection)}>
            <PlugZap className="size-4" /> Manage
          </Button>
        ) : (
          <Button size="sm" onClick={() => onConnect(integration)}>
            <Plug className="size-4" /> Connect
          </Button>
        )}
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: IntegrationStatus }) {
  const map: Record<
    IntegrationStatus,
    { icon: typeof CheckCircle2; className: string; label: string }
  > = {
    available: { icon: Plug, className: "bg-muted text-muted-foreground", label: STATUS_LABEL.available },
    connected: { icon: CheckCircle2, className: "bg-success/15 text-success", label: STATUS_LABEL.connected },
    disconnected: { icon: Plug, className: "bg-muted text-muted-foreground", label: STATUS_LABEL.disconnected },
    error: { icon: AlertCircle, className: "bg-destructive/15 text-destructive", label: STATUS_LABEL.error },
    deprecated: { icon: AlertCircle, className: "bg-warning/15 text-warning", label: STATUS_LABEL.deprecated },
  };
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
        cfg.className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {cfg.label}
    </span>
  );
}

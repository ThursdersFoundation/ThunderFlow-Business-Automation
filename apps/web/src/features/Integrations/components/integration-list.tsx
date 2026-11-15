"use client";

/**
 * IntegrationList — grid of IntegrationCards with category filter + search.
 * Backed by the useIntegrations hook.
 */
import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIntegrations } from "../hooks/use-integrations";
import { IntegrationCard } from "./integration-card";
import type {
  IntegrationCategory,
  IntegrationConnection,
  IntegrationDescriptor,
} from "../types/integration.types";

interface IntegrationListProps {
  onConnect: (integration: IntegrationDescriptor) => void;
  onManage: (connection: IntegrationConnection) => void;
  className?: string;
}

export function IntegrationList({ onConnect, onManage, className }: IntegrationListProps) {
  const { catalog, connections, isLoading, error } = useIntegrations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<IntegrationCategory | "all">("all");

  const categories = useMemo(() => {
    const set = new Set<IntegrationCategory>(catalog.map((c) => c.category));
    return ["all", ...Array.from(set).sort()] as Array<IntegrationCategory | "all">;
  }, [catalog]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.capabilities.some((c) => c.name.toLowerCase().includes(q))
      );
    });
  }, [catalog, search, category]);

  const connectionByIntegration = useMemo(() => {
    const map = new Map<string, IntegrationConnection>();
    for (const c of connections) {
      // Most-recent connection wins; in practice one per integration per tenant.
      if (!map.has(c.integrationId)) map.set(c.integrationId, c);
    }
    return map;
  }, [connections]);

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <section className={cn("space-y-4", className)} aria-labelledby="integrations-heading">
      <header>
        <h1 id="integrations-heading" className="text-2xl font-semibold tracking-tight">
          Integrations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect ThunderFlow to the tools your team already uses.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations…"
            className="pl-9"
            aria-label="Search integrations"
          />
        </div>
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs capitalize transition-colors",
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Loading catalog…
        </div>
      ) : filtered.length === 0 ? (
        <p className="p-10 text-center text-sm text-muted-foreground">
          No integrations match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <IntegrationCard
              key={item.id}
              integration={item}
              connection={connectionByIntegration.get(item.id)}
              onConnect={onConnect}
              onManage={onManage}
            />
          ))}
        </div>
      )}
    </section>
  );
}

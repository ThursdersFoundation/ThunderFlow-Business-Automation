"use client";

/**
 * ReportViewer — renders a report result as a table + optional chart.
 * Uses a lightweight inline SVG chart for bar/line; falls back to a
 * simple table for everything else.
 */
import { Loader2, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReportColumn, ReportResult, ReportRow } from "../types/report.types";

interface ReportViewerProps {
  result: ReportResult | null;
  isLoading: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  className?: string;
}

function formatCell(value: string | number | boolean | null, column: ReportColumn): string {
  if (value === null || value === undefined) return "—";
  if (column.type === "boolean") return value ? "Yes" : "No";
  if (column.type === "date") {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }
  if (column.type === "duration") {
    const ms = Number(value);
    if (!Number.isFinite(ms)) return String(value);
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
    const m = Math.floor(ms / 60_000);
    const s = Math.round((ms % 60_000) / 1000);
    return `${m}m ${s}s`;
  }
  if (column.type === "number") {
    const num = Number(value);
    if (!Number.isFinite(num)) return String(value);
    return num.toLocaleString();
  }
  return String(value);
}

export function ReportViewer({
  result,
  isLoading,
  error,
  onLoadMore,
  className,
}: ReportViewerProps) {
  if (isLoading && !result) {
    return (
      <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Running report…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        <Table2 className="mx-auto mb-2 size-6 opacity-40" aria-hidden />
        Configure a report and click Run to see results.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {result.summary.totals ? (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(result.summary.totals).map(([key, value]) => (
            <div key={key} className="rounded-md border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{key}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">
                {Number(value).toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {result.columns.map((column) => (
                <th key={column.key} className="px-3 py-2 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {result.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={result.columns.length}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  No rows matched the current filters.
                </td>
              </tr>
            ) : (
              result.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-accent/30">
                  {result.columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 tabular-nums">
                      {formatCell((row as ReportRow)[column.key] ?? null, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {result.rows.length} of {result.summary.totalRows} rows ·{" "}
          {result.durationMs < 1000 ? `${result.durationMs}ms` : `${(result.durationMs / 1000).toFixed(1)}s`}
        </span>
        {result.summary.hasMore ? (
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
            Load more
          </Button>
        ) : null}
      </footer>
    </div>
  );
}

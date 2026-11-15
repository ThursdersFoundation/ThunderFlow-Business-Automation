"use client";

/**
 * ReportFilters — reusable filter controls for a report config.
 * Renders the date-range preset selector + per-field filter chips that
 * open a small inline form. Designed to live above the report viewer.
 */
import { useState } from "react";
import { Calendar, Filter, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ReportDateRange,
  ReportFilter,
} from "../types/report.types";

const RANGE_PRESETS: Array<{ value: ReportDateRange["preset"]; label: string }> = [
  { value: "today", label: "Today" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "month_to_date", label: "Month to date" },
  { value: "quarter_to_date", label: "Quarter to date" },
  { value: "year_to_date", label: "Year to date" },
];

const FIELDS: Array<{ key: string; label: string; type: "string" | "number" | "date" | "select"; options?: string[] }> = [
  { key: "workflowName", label: "Workflow", type: "string" },
  { key: "status", label: "Status", type: "select", options: ["queued", "running", "completed", "failed", "cancelled", "timed_out"] },
  { key: "triggeredBy", label: "Triggered by", type: "select", options: ["user", "schedule", "webhook", "event", "integration", "api"] },
  { key: "durationMs", label: "Duration (ms)", type: "number" },
  { key: "costUsd", label: "Cost (USD)", type: "number" },
  { key: "integrationName", label: "Integration", type: "string" },
];

const OPERATORS: Array<{ value: ReportFilter["op"]; label: string }> = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "≥" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "≤" },
  { value: "in", label: "is one of" },
  { value: "between", label: "between" },
  { value: "contains", label: "contains" },
];

interface ReportFiltersProps {
  dateRange: ReportDateRange;
  filters: ReportFilter[];
  onChange: (dateRange: ReportDateRange, filters: ReportFilter[]) => void;
  className?: string;
}

export function ReportFilters({
  dateRange,
  filters,
  onChange,
  className,
}: ReportFiltersProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ field: string; op: ReportFilter["op"]; value: string }>({
    field: FIELDS[0].key,
    op: "eq",
    value: "",
  });

  const setRange = (preset: ReportDateRange["preset"]) => {
    onChange({ preset }, filters);
  };

  const addFilter = () => {
    if (!draft.value.trim()) return;
    const field = FIELDS.find((f) => f.key === draft.field);
    const parsedValue: ReportFilter["value"] =
      field?.type === "number"
        ? Number(draft.value)
        : draft.op === "in"
          ? draft.value.split(",").map((s) => s.trim())
          : draft.value.trim();
    onChange(dateRange, [
      ...filters,
      {
        field: draft.field,
        op: draft.op,
        value: parsedValue,
      },
    ]);
    setDraft({ field: FIELDS[0].key, op: "eq", value: "" });
    setAdding(false);
  };

  const removeFilter = (idx: number) => {
    onChange(dateRange, filters.filter((_, i) => i !== idx));
  };

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-sm font-medium">Range:</span>
        <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Date range preset">
          {RANGE_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={dateRange.preset === p.value}
              onClick={() => setRange(p.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs transition-colors",
                dateRange.preset === p.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-sm font-medium">Filters:</span>
        {filters.length === 0 && !adding ? (
          <span className="text-xs text-muted-foreground">None — showing all rows.</span>
        ) : null}
        {filters.map((f, idx) => (
          <Badge key={idx} variant="secondary" className="gap-1 pr-1">
            <span className="font-medium">{fieldLabel(f.field)}</span>
            <span className="text-muted-foreground">{opLabel(f.op)}</span>
            <span>{String(f.value)}</span>
            <button
              type="button"
              onClick={() => removeFilter(idx)}
              className="rounded-full p-0.5 hover:bg-accent"
              aria-label={`Remove filter on ${f.field}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        {adding ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <select
              value={draft.field}
              onChange={(e) => setDraft((d) => ({ ...d, field: e.target.value }))}
              className="rounded border border-input bg-background px-2 py-1 text-xs"
              aria-label="Filter field"
            >
              {FIELDS.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={draft.op}
              onChange={(e) => setDraft((d) => ({ ...d, op: e.target.value as ReportFilter["op"] }))}
              className="rounded border border-input bg-background px-2 py-1 text-xs"
              aria-label="Filter operator"
            >
              {OPERATORS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Input
              type="text"
              value={draft.value}
              onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
              placeholder="value"
              className="h-7 w-32 text-xs"
              aria-label="Filter value"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFilter();
                }
              }}
            />
            <Button size="sm" variant="outline" onClick={addFilter}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
            <Plus className="size-3.5" /> Add filter
          </Button>
        )}
      </div>
    </div>
  );
}

function fieldLabel(key: string): string {
  return FIELDS.find((f) => f.key === key)?.label ?? key;
}

function opLabel(op: ReportFilter["op"]): string {
  return OPERATORS.find((o) => o.value === op)?.label ?? op;
}

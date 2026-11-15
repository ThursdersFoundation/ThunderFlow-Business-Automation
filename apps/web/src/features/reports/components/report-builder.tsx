"use client";

/**
 * ReportBuilder — configures and runs a report.
 * Lets the user pick a type, select fields + aggregations, group, sort,
 * and choose a chart hint. Mirrors the report-config UI in the right
 * sidebar. Runs the report live and delegates rendering to ReportViewer.
 */
import { useCallback, useState } from "react";
import { BarChart3, Play, Save, SaveAll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useReportRun, useReports } from "../hooks/use-reports";
import { ReportFilters } from "./report-filters";
import { ReportViewer } from "./report-viewer";
import type {
  Aggregation,
  ChartType,
  ReportConfig,
  ReportDateRange,
  ReportField,
  ReportFilter,
  ReportType,
} from "../types/report.types";

const REPORT_TYPES: Array<{ value: ReportType; label: string; description: string }> = [
  { value: "executions_summary", label: "Executions summary", description: "Run counts and durations over time." },
  { value: "workflow_performance", label: "Workflow performance", description: "Per-workflow success rate and latency." },
  { value: "approval_latency", label: "Approval latency", description: "Time-to-decide per approval." },
  { value: "integration_usage", label: "Integration usage", description: "Calls per integration." },
  { value: "cost_breakdown", label: "Cost breakdown", description: "Spend by workflow and resource." },
  { value: "audit_log", label: "Audit log", description: "Raw audit events with filters." },
];

const FIELD_CATALOG: Record<ReportType, Array<{ key: string; label: string; aggregations?: Aggregation[] }>> = {
  executions_summary: [
    { key: "workflowName", label: "Workflow" },
    { key: "status", label: "Status" },
    { key: "count", label: "Run count", aggregations: ["count", "sum"] },
    { key: "durationMs", label: "Duration", aggregations: ["avg", "p50", "p95", "p99", "max"] },
    { key: "costUsd", label: "Cost", aggregations: ["sum", "avg"] },
  ],
  workflow_performance: [
    { key: "workflowName", label: "Workflow" },
    { key: "successRate", label: "Success rate", aggregations: ["avg"] },
    { key: "p95DurationMs", label: "P95 duration", aggregations: ["avg", "max"] },
    { key: "failureCount", label: "Failure count", aggregations: ["sum"] },
  ],
  approval_latency: [
    { key: "workflowName", label: "Workflow" },
    { key: "requester", label: "Requester" },
    { key: "decisionMs", label: "Decision time", aggregations: ["avg", "p50", "p95", "max"] },
    { key: "decision", label: "Decision" },
  ],
  integration_usage: [
    { key: "integrationName", label: "Integration" },
    { key: "callCount", label: "Calls", aggregations: ["sum"] },
    { key: "errorCount", label: "Errors", aggregations: ["sum"] },
    { key: "avgLatencyMs", label: "Avg latency", aggregations: ["avg"] },
  ],
  cost_breakdown: [
    { key: "workflowName", label: "Workflow" },
    { key: "tokensUsed", label: "Tokens", aggregations: ["sum"] },
    { key: "costUsd", label: "Cost", aggregations: ["sum", "avg"] },
  ],
  audit_log: [
    { key: "timestamp", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "target", label: "Target" },
  ],
  custom: [
    { key: "workflowName", label: "Workflow" },
    { key: "count", label: "Count", aggregations: ["count"] },
  ],
};

const CHART_OPTIONS: Array<{ value: ChartType; label: string }> = [
  { value: "table", label: "Table" },
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "pie", label: "Pie" },
  { value: "scalar", label: "Scalar" },
];

interface ReportBuilderProps {
  className?: string;
  initialConfig?: ReportConfig;
}

const DEFAULT_CONFIG: ReportConfig = {
  type: "executions_summary",
  name: "Executions summary",
  fields: [{ key: "workflowName", label: "Workflow" }, { key: "count", label: "Runs", aggregation: "count" }],
  filters: [],
  groupBy: [{ field: "workflowName", label: "Workflow" }],
  dateRange: { preset: "last_30_days" },
  limit: 100,
  chart: { type: "bar", xField: "workflowName", yField: "count" },
};

export function ReportBuilder({ className, initialConfig }: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [name, setName] = useState(config.name);
  const [description, setDescription] = useState(config.description ?? "");
  const { run, result, isRunning, error, loadMore } = useReportRun();
  const { createSaved } = useReports();
  const [saving, setSaving] = useState(false);

  const setField = useCallback(<K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setRange = (dateRange: ReportDateRange, filters: ReportFilter[]) => {
    setConfig((prev) => ({ ...prev, dateRange, filters }));
  };

  const fieldCatalog = FIELD_CATALOG[config.type];

  const toggleField = (fieldKey: string) => {
    const existing = config.fields.find((f) => f.key === fieldKey);
    if (existing) {
      setField("fields", config.fields.filter((f) => f.key !== fieldKey));
    } else {
      const catalog = fieldCatalog.find((f) => f.key === fieldKey);
      if (catalog) {
        const newField: ReportField = { key: catalog.key, label: catalog.label };
        setField("fields", [...config.fields, newField]);
      }
    }
  };

  const setAggregation = (fieldKey: string, aggregation: Aggregation | undefined) => {
    setField(
      "fields",
      config.fields.map((f) =>
        f.key === fieldKey ? { ...f, aggregation } : f,
      ),
    );
  };

  const onRun = () => {
    run({ ...config, name });
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await createSaved({
        name,
        description,
        type: config.type,
        config: { ...config, name },
        scheduled: false,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={cn("space-y-4", className)}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Report name"
            className="text-lg font-semibold"
            aria-label="Report name"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            aria-label="Report description"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSave} disabled={saving || !name.trim()}>
            {saving ? <SaveAll className="size-4" /> : <Save className="size-4" />} Save
          </Button>
          <Button onClick={onRun} disabled={isRunning}>
            <Play className="size-4" /> Run
          </Button>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 rounded-lg border bg-card p-4">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Report type
            </h3>
            <ul className="space-y-1">
              {REPORT_TYPES.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({ ...prev, type: opt.value }));
                      setName(opt.label);
                    }}
                    className={cn(
                      "block w-full rounded-md p-2 text-left text-sm transition-colors",
                      config.type === opt.value
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent",
                    )}
                  >
                    <span className="block font-medium">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fields
            </h3>
            <ul className="space-y-1.5">
              {fieldCatalog.map((field) => {
                const selected = config.fields.find((f) => f.key === field.key);
                return (
                  <li key={field.key}>
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(selected)}
                          onChange={() => toggleField(field.key)}
                          className="size-4 rounded border-input text-primary"
                        />
                        {field.label}
                      </span>
                      {selected && field.aggregations ? (
                        <select
                          value={selected.aggregation ?? ""}
                          onChange={(e) =>
                            setAggregation(
                              field.key,
                              (e.target.value || undefined) as Aggregation | undefined,
                            )
                          }
                          className="ml-6 w-32 rounded border border-input bg-background px-2 py-0.5 text-xs"
                          aria-label={`Aggregation for ${field.label}`}
                        >
                          <option value="">raw</option>
                          {field.aggregations.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <BarChart3 className="size-3.5" /> Chart
            </h3>
            <select
              value={config.chart?.type ?? "table"}
              onChange={(e) =>
                setField("chart", {
                  type: e.target.value as ChartType,
                  xField: config.chart?.xField,
                  yField: config.chart?.yField,
                })
              }
              className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
            >
              {CHART_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Limit rows
            </h3>
            <Input
              type="number"
              min={1}
              max={10_000}
              value={config.limit ?? 100}
              onChange={(e) => setField("limit", Math.max(1, Number(e.target.value) || 100))}
            />
          </div>
        </aside>

        <div className="space-y-3">
          <ReportFilters
            dateRange={config.dateRange}
            filters={config.filters ?? []}
            onChange={setRange}
          />
          <ReportViewer
            result={result}
            isLoading={isRunning}
            error={error}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </section>
  );
}

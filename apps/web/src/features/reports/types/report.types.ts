/**
 * Reports feature — type definitions
 * Saved reports, ad-hoc query results, and exports.
 */

export type ReportType =
  | "executions_summary"
  | "workflow_performance"
  | "approval_latency"
  | "integration_usage"
  | "cost_breakdown"
  | "audit_log"
  | "custom";

export type ReportFormat = "json" | "csv" | "xlsx" | "pdf";

export type ChartType = "bar" | "line" | "pie" | "table" | "scalar";

export type Aggregation = "count" | "sum" | "avg" | "min" | "max" | "p50" | "p95" | "p99";

export interface ReportField {
  /** Field key, e.g. "durationMs" or "status". */
  key: string;
  label: string;
  /** Aggregation applied; undefined for raw dimensions. */
  aggregation?: Aggregation;
}

export interface ReportFilter {
  field: string;
  /** Operator — eq, neq, gt, gte, lt, lte, in, between, contains. */
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "between" | "contains";
  value: string | number | boolean | Array<string | number>;
}

export interface ReportGroup {
  /** Dimension to group rows by. */
  field: string;
  label: string;
}

export interface ReportSort {
  field: string;
  direction: "asc" | "desc";
}

export interface ReportDateRange {
  /** Preset name OR custom ISO start/end pair. */
  preset?: "today" | "last_7_days" | "last_30_days" | "last_90_days" | "month_to_date" | "quarter_to_date" | "year_to_date" | "custom";
  start?: string;
  end?: string;
}

export interface ReportConfig {
  type: ReportType;
  name: string;
  description?: string;
  fields: ReportField[];
  filters?: ReportFilter[];
  groupBy?: ReportGroup[];
  sortBy?: ReportSort[];
  dateRange: ReportDateRange;
  /** Limit number of result rows. */
  limit?: number;
  /** Optional chart rendering hint. */
  chart?: {
    type: ChartType;
    xField?: string;
    yField?: string;
  };
}

export interface ReportColumn {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "boolean" | "duration";
}

export interface ReportRow {
  [key: string]: string | number | boolean | null;
}

export interface ReportSummary {
  totalRows: number;
  /** Has more rows than returned (cursor available). */
  hasMore: boolean;
  cursor?: string;
  /** Optional scalar totals to show above the table. */
  totals?: Record<string, number>;
}

export interface ReportResult {
  id: string;
  columns: ReportColumn[];
  rows: ReportRow[];
  summary: ReportSummary;
  /** ISO timestamp the result was generated. */
  generatedAt: string;
  /** Time to produce the result, in ms. */
  durationMs: number;
}

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  config: ReportConfig;
  /** User id who owns the saved report. */
  ownerId: string;
  /** Whether the report is scheduled and emailed periodically. */
  scheduled: boolean;
  scheduleCron?: string;
  /** Recipients for scheduled exports. */
  scheduleRecipients?: string[];
  createdAt: string;
  updatedAt: string;
  lastRunAt: string | null;
}

export interface SavedReportListResponse {
  items: SavedReport[];
  total: number;
}

export interface ExportRequest {
  reportId?: string;
  config?: ReportConfig;
  format: ReportFormat;
  /** Include chart image alongside tabular data (xlsx / pdf). */
  includeChart?: boolean;
}

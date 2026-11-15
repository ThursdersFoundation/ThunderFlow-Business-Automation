"use client";

/**
 * ReportExport — pick a format and trigger a download.
 * Backed by `reportService.download`, which negotiates a signed URL.
 */
import { useState } from "react";
import { Download, FileSpreadsheet, FileText, FileJson, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { reportService } from "../services/report-service";
import type { ExportRequest, ReportConfig, ReportFormat } from "../types/report.types";

const FORMATS: Array<{
  value: ReportFormat;
  label: string;
  icon: typeof FileText;
  mime: string;
}> = [
  { value: "csv", label: "CSV", icon: FileText, mime: "text/csv" },
  { value: "xlsx", label: "Excel", icon: FileSpreadsheet, mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { value: "json", label: "JSON", icon: FileJson, mime: "application/json" },
  { value: "pdf", label: "PDF", icon: FileText, mime: "application/pdf" },
];

interface ReportExportProps {
  /** Saved report id, if exporting a saved report. */
  reportId?: string;
  /** Ad-hoc config, if exporting an unsaved report. */
  config?: ReportConfig;
  className?: string;
}

export function ReportExport({ reportId, config, className }: ReportExportProps) {
  const [format, setFormat] = useState<ReportFormat>("xlsx");
  const [includeChart, setIncludeChart] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExport, setLastExport] = useState<{ format: ReportFormat; expiresAt: string } | null>(null);

  const onExport = async () => {
    if (!reportId && !config) {
      setError("Save the report first, or run it as an ad-hoc query.");
      return;
    }
    setExporting(true);
    setError(null);
    try {
      const payload: ExportRequest = {
        reportId,
        config,
        format,
        includeChart,
      };
      const { expiresAt } = await reportService.export(payload);
      setLastExport({ format, expiresAt });
      // Trigger the signed-URL download.
      await reportService.download(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      <header>
        <h3 className="text-sm font-semibold">Export</h3>
        <p className="text-xs text-muted-foreground">
          Generate a downloadable file. The link is signed and expires in 5 minutes.
        </p>
      </header>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-muted-foreground">Format</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FORMATS.map((opt) => {
            const Icon = opt.icon;
            const active = format === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1 rounded-md border p-3 text-center text-sm transition-colors",
                  active ? "border-primary bg-primary/5" : "hover:bg-accent",
                )}
              >
                <input
                  type="radio"
                  name="export-format"
                  value={opt.value}
                  checked={active}
                  onChange={() => setFormat(opt.value)}
                  className="sr-only"
                />
                <Icon className="size-5 text-foreground/80" aria-hidden />
                <span className="text-xs font-medium">{opt.label}</span>
                <span className="text-[10px] text-muted-foreground">{opt.mime}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeChart}
          onChange={(e) => setIncludeChart(e.target.checked)}
          className="size-4 rounded border-input text-primary"
        />
        Include chart image (Excel &amp; PDF only)
      </label>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {lastExport ? (
        <p className="text-xs text-muted-foreground">
          Last export: {lastExport.format.toUpperCase()} · link expires{" "}
          {new Date(lastExport.expiresAt).toLocaleTimeString()}.
        </p>
      ) : null}

      <Button onClick={onExport} disabled={exporting} className="w-full sm:w-auto">
        {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        Download {format.toUpperCase()}
      </Button>
    </div>
  );
}

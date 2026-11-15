"use client";

/**
 * useReports — runs ad-hoc reports, manages saved reports.
 */
import { useCallback, useEffect, useState } from "react";
import { reportService } from "../services/report-service";
import type {
  ReportConfig,
  ReportResult,
  SavedReport,
  SavedReportListResponse,
} from "../types/report.types";

interface UseReportsResult {
  saved: SavedReport[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createSaved: (
    report: Omit<SavedReport, "id" | "createdAt" | "updatedAt" | "lastRunAt" | "ownerId">,
  ) => Promise<SavedReport>;
  updateSaved: (id: string, patch: Partial<SavedReport>) => Promise<void>;
  deleteSaved: (id: string) => Promise<void>;
}

export function useReports(): UseReportsResult {
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result: SavedReportListResponse = await reportService.listSaved();
      setSaved(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createSaved = useCallback(
    async (report: Parameters<UseReportsResult["createSaved"]>[0]) => {
      const next = await reportService.createSaved(report);
      setSaved((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const updateSaved = useCallback(async (id: string, patch: Partial<SavedReport>) => {
    const next = await reportService.updateSaved(id, patch);
    setSaved((prev) => prev.map((r) => (r.id === id ? next : r)));
  }, []);

  const deleteSaved = useCallback(async (id: string) => {
    await reportService.deleteSaved(id);
    setSaved((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    saved,
    isLoading,
    error,
    refetch: fetchAll,
    createSaved,
    updateSaved,
    deleteSaved,
  };
}

interface UseReportRunResult {
  result: ReportResult | null;
  isRunning: boolean;
  error: string | null;
  run: (config: ReportConfig) => Promise<ReportResult | null>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function useReportRun(): UseReportRunResult {
  const [result, setResult] = useState<ReportResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastConfig, setLastConfig] = useState<ReportConfig | null>(null);

  const run = useCallback(async (config: ReportConfig) => {
    setIsRunning(true);
    setError(null);
    setLastConfig(config);
    try {
      const next = await reportService.run(config);
      setResult(next);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run report.");
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!result?.summary.hasMore || !result.summary.cursor || !lastConfig) return;
    setIsRunning(true);
    try {
      const more = await reportService.run(lastConfig, result.summary.cursor);
      setResult((prev) =>
        prev
          ? {
              ...more,
              rows: [...prev.rows, ...more.rows],
            }
          : more,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more rows.");
    } finally {
      setIsRunning(false);
    }
  }, [result, lastConfig]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLastConfig(null);
  }, []);

  return { result, isRunning, error, run, loadMore, reset };
}

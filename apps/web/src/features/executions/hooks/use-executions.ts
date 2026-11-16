"use client";

/**
 * useExecutions — list executions with filter + pagination, plus a single-run
 * fetcher for the detail page and live status polling.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { executionService } from "../services/execution-service";
import type {
  Execution,
  ExecutionListResponse,
  ExecutionQuery,
  ExecutionStatus,
} from "../types/execution.types";

const DEFAULT_PAGE_SIZE = 20;
const POLL_INTERVAL_MS = 3000;
const ACTIVE_STATUSES: ExecutionStatus[] = ["queued", "running", "awaiting_approval"];

interface UseExecutionsResult {
  data: ExecutionListResponse | null;
  isLoading: boolean;
  error: string | null;
  query: ExecutionQuery;
  setQuery: (next: Partial<ExecutionQuery>) => void;
  refetch: () => void;
}

export function useExecutions(initial: ExecutionQuery = {}): UseExecutionsResult {
  const [query, setQueryState] = useState<ExecutionQuery>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "queuedAt",
    sortDir: "desc",
    ...initial,
  });
  const [data, setData] = useState<ExecutionListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await executionService.list(query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load executions.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Auto-refresh while there are active runs.
  useEffect(() => {
    if (!data?.items.some((i) => ACTIVE_STATUSES.includes(i.status))) return;
    const timer = setInterval(() => void fetchPage(), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [data, fetchPage]);

  const setQuery = useCallback((next: Partial<ExecutionQuery>) => {
    setQueryState((prev) => ({ ...prev, ...next, page: next.page ?? 1 }));
  }, []);

  return {
    data,
    isLoading,
    error,
    query,
    setQuery,
    refetch: fetchPage,
  };
}

interface UseExecutionResult {
  execution: Execution | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  cancel: () => Promise<void>;
  retry: () => Promise<void>;
}

export function useExecution(executionId: string | null): UseExecutionResult {
  const [execution, setExecution] = useState<Execution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOne = useCallback(async () => {
    if (!executionId) {
      setExecution(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await executionService.get(executionId);
      setExecution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load execution.");
    } finally {
      setIsLoading(false);
    }
  }, [executionId]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  // Poll while the run is still active.
  useEffect(() => {
    if (!execution || !ACTIVE_STATUSES.includes(execution.status)) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => void fetchOne(), POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [execution?.status, fetchOne]);

  const cancel = useCallback(async () => {
    if (!executionId) return;
    try {
      const next = await executionService.cancel(executionId);
      setExecution(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel execution.");
    }
  }, [executionId]);

  const retry = useCallback(async () => {
    if (!executionId) return;
    try {
      const next = await executionService.retry(executionId);
      setExecution(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to retry execution.");
    }
  }, [executionId]);

  return {
    execution,
    isLoading,
    error,
    refetch: fetchOne,
    cancel,
    retry,
  };
}

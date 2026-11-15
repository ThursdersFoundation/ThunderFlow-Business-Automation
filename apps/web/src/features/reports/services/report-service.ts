/**
 * Reports feature — service layer
 */
import { apiClient } from "@/lib/api-client";
import type {
  ExportRequest,
  ReportConfig,
  ReportResult,
  SavedReport,
  SavedReportListResponse,
} from "../types/report.types";

const BASE = "/api/reports";

export const reportService = {
  async listSaved(): Promise<SavedReportListResponse> {
    return apiClient.get<SavedReportListResponse>(`${BASE}/saved`);
  },

  async getSaved(id: string): Promise<SavedReport> {
    return apiClient.get<SavedReport>(`${BASE}/saved/${id}`);
  },

  async createSaved(report: Omit<SavedReport, "id" | "createdAt" | "updatedAt" | "lastRunAt" | "ownerId">): Promise<SavedReport> {
    return apiClient.post<SavedReport>(`${BASE}/saved`, report);
  },

  async updateSaved(id: string, patch: Partial<SavedReport>): Promise<SavedReport> {
    return apiClient.patch<SavedReport>(`${BASE}/saved/${id}`, patch);
  },

  async deleteSaved(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/saved/${id}`);
  },

  /** Run an ad-hoc report immediately. */
  async run(config: ReportConfig, cursor?: string): Promise<ReportResult> {
    return apiClient.post<ReportResult>(`${BASE}/run`, { config, cursor });
  },

  /** Run a saved report by id. */
  async runSaved(id: string, cursor?: string): Promise<ReportResult> {
    return apiClient.post<ReportResult>(`${BASE}/saved/${id}/run`, { cursor });
  },

  /** Schedule a saved report for periodic email delivery. */
  async schedule(id: string, cron: string, recipients: string[]): Promise<SavedReport> {
    return apiClient.post<SavedReport>(`${BASE}/saved/${id}/schedule`, { cron, recipients });
  },

  async unschedule(id: string): Promise<SavedReport> {
    return apiClient.delete<SavedReport>(`${BASE}/saved/${id}/schedule`);
  },

  /**
   * Request an export. Returns a download URL that the browser navigates to.
   * The URL is signed and expires after 5 minutes.
   */
  async export(payload: ExportRequest): Promise<{ downloadUrl: string; expiresAt: string }> {
    return apiClient.post(`${BASE}/export`, payload);
  },

  /** Kick off a synchronous download by following the returned URL. */
  async download(payload: ExportRequest): Promise<void> {
    const { downloadUrl } = await this.export(payload);
    window.location.href = downloadUrl;
  },
};

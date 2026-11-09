import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Workflows" };

const WORKFLOWS = [
  { id: "wf_001", name: "Invoice Routing", status: "active", lastRun: "2m ago", runs: 1284, success: 99.1 },
  { id: "wf_002", name: "Daily Sales Sync", status: "active", lastRun: "12m ago", runs: 365, success: 100 },
  { id: "wf_003", name: "Onboarding Flow", status: "paused", lastRun: "1h ago", runs: 89, success: 96.2 },
  { id: "wf_004", name: "Slack Notification", status: "error", lastRun: "2h ago", runs: 412, success: 92.7 },
  { id: "wf_005", name: "Expense Approval v2", status: "draft", lastRun: "—", runs: 0, success: 0 },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  draft: "bg-slate-100 text-slate-600",
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Workflows</h1>
          <p className="text-sm text-slate-500">{WORKFLOWS.length} workflows in your workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/workflows/templates" className="btn-secondary">Templates</Link>
          <Link href="/workflows/new" className="btn-primary">New workflow</Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
               width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" placeholder="Search workflows…"
                 className="input pl-9" />
        </div>
        <select className="input sm:w-40">
          <option>All statuses</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Error</option>
          <option>Draft</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Runs</th>
              <th className="px-4 py-3 font-medium">Success</th>
              <th className="px-4 py-3 font-medium">Last run</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {WORKFLOWS.map((wf) => (
              <tr key={wf.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/workflows/${wf.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                    {wf.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[wf.status]}`}>
                    {wf.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{wf.runs.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600">{wf.success ? `${wf.success}%` : "—"}</td>
                <td className="px-4 py-3 text-slate-500">{wf.lastRun}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/workflows/${wf.id}/edit`} className="text-indigo-600 hover:text-indigo-700">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

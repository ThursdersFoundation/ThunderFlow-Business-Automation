import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Reports" };

const REPORTS = [
  { id: "rep_001", name: "Weekly Workflow Summary", schedule: "Every Monday 9:00", lastRun: "2026-11-02" },
  { id: "rep_002", name: "Approval Turnaround Time", schedule: "Monthly", lastRun: "2026-10-31" },
  { id: "rep_003", name: "Integration Health", schedule: "Daily 06:00", lastRun: "2026-11-03" },
  { id: "rep_004", name: "Cost by Workflow", schedule: "Monthly", lastRun: "2026-10-31" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500">Scheduled and on-demand reports for your workspace.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports/analytics" className="btn-secondary">Open analytics</Link>
          <button className="btn-primary">New report</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Report</th>
              <th className="px-4 py-3 font-medium">Schedule</th>
              <th className="px-4 py-3 font-medium">Last run</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {REPORTS.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/reports/${r.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                    {r.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.schedule}</td>
                <td className="px-4 py-3 text-slate-500">{r.lastRun}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-indigo-600 hover:text-indigo-700">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

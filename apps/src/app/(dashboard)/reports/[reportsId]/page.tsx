import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Report details" };

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  if (!reportId.startsWith("rep_")) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/reports" className="hover:text-slate-900">Reports</Link>
          <span>/</span>
          <span className="text-slate-900">Weekly Workflow Summary</span>
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Weekly Workflow Summary</h1>
        <p className="text-sm text-slate-500">Schedule: Every Monday 9:00 · Last generated 2026-11-02</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-primary">Download CSV</button>
        <button className="btn-secondary">Download PDF</button>
        <button className="btn-secondary">Schedule</button>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Summary (week of Oct 27 – Nov 2)</h2>
        <table className="mt-4 w-full text-sm">
          <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2 font-medium">Workflow</th>
              <th className="py-2 font-medium">Runs</th>
              <th className="py-2 font-medium">Success</th>
              <th className="py-2 font-medium">Avg duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["Invoice Routing", "312", "99.4%", "1.1s"],
              ["Daily Sales Sync", "7", "100%", "1.3s"],
              ["Slack Notification", "98", "94.1%", "0.3s"],
              ["Onboarding Flow", "4", "100%", "5.2s"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} className={`py-2 ${i === 0 ? "font-medium text-slate-900" : "text-slate-600"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

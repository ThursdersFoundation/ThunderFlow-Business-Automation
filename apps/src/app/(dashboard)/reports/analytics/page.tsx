import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

const TOP_WORKFLOWS = [
  { name: "Invoice Routing", runs: 1284, success: 99.1, avgDuration: "1.2s" },
  { name: "Daily Sales Sync", runs: 365, success: 100, avgDuration: "1.4s" },
  { name: "Slack Notification", runs: 412, success: 92.7, avgDuration: "0.3s" },
  { name: "Lead Routing", runs: 280, success: 98.2, avgDuration: "2.3s" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Drill into execution metrics across all workflows.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total executions (30d)", value: "12,840" },
          { label: "Avg. duration", value: "1.3s" },
          { label: "Success rate", value: "98.4%" },
          { label: "Active workflows", value: "248" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Top workflows by execution volume</h2>
        <div className="mt-4 space-y-3">
          {TOP_WORKFLOWS.map((w) => {
            const pct = (w.runs / 1284) * 100;
            return (
              <div key={w.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{w.name}</span>
                  <span className="text-slate-500">{w.runs.toLocaleString()} runs · {w.success}% success · {w.avgDuration}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-900">Executions by status</h2>
          <div className="mt-4 space-y-2 text-sm">
            {[
              { label: "Success", count: 12634, color: "bg-emerald-500" },
              { label: "Failed", count: 156, color: "bg-red-500" },
              { label: "Running", count: 12, color: "bg-blue-500" },
              { label: "Cancelled", count: 38, color: "bg-slate-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded ${s.color}`} />
                <span className="flex-1 text-slate-700">{s.label}</span>
                <span className="font-medium text-slate-900">{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-900">Top failure reasons</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {[
              "Invalid webhook payload (62)",
              "Integration auth expired (38)",
              "Approval timeout (24)",
              "Rate limit exceeded (18)",
              "Node config error (14)",
            ].map((r, i) => (
              <li key={r} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-700">
                  {i + 1}
                </span>
                <span className="flex-1 text-slate-700">{r.split(" (")[0]}</span>
                <span className="text-slate-500">{r.match(/\((\d+)\)/)?.[1]}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

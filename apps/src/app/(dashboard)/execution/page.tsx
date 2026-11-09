import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Executions" };

const EXECUTIONS = [
  { id: "exec_9281", workflow: "Invoice Routing", status: "success", startedAt: "09:42:11", duration: "1.2s" },
  { id: "exec_9280", workflow: "Daily Sales Sync", status: "success", startedAt: "09:30:00", duration: "1.4s" },
  { id: "exec_9279", workflow: "Onboarding Flow", status: "running", startedAt: "09:28:42", duration: "—" },
  { id: "exec_9278", workflow: "Slack Notification", status: "failed", startedAt: "09:21:13", duration: "0.3s" },
  { id: "exec_9277", workflow: "Invoice Routing", status: "success", startedAt: "08:42:11", duration: "1.1s" },
  { id: "exec_9276", workflow: "Lead Routing", status: "success", startedAt: "08:30:00", duration: "2.3s" },
];

const STATUS_STYLE: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
};

export default function ExecutionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Executions</h1>
        <p className="text-sm text-slate-500">All workflow executions across your workspace.</p>
      </div>

      <div className="flex gap-2">
        {["All", "Success", "Failed", "Running"].map((f, i) => (
          <button key={f}
                  className={`rounded-md px-3 py-1.5 text-sm ${i === 0 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Execution ID</th>
              <th className="px-4 py-3 font-medium">Workflow</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Started</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EXECUTIONS.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/executions/${e.id}`} className="font-mono text-xs text-indigo-600 hover:text-indigo-700">
                    {e.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-900">{e.workflow}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[e.status]}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{e.startedAt}</td>
                <td className="px-4 py-3 text-slate-600">{e.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

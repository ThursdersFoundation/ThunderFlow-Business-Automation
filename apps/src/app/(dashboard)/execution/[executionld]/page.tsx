import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Execution details" };

const STEPS = [
  { id: 1, node: "Email received", status: "success", duration: "0.1s", log: "Received invoice #INV-2026-0042 from vendor@acme.com" },
  { id: 2, node: "Extract data", status: "success", duration: "0.5s", log: "Extracted: amount=$842.50, vendor=Acme Corp, due=2026-11-17" },
  { id: 3, node: "Amount > $500?", status: "success", duration: "0.0s", log: "Condition matched: amount (842.50) > 500 → branch A" },
  { id: 4, node: "Manager approval", status: "success", duration: "8m 12s", log: "Approved by jane@acme.com at 09:50:23" },
  { id: 5, node: "Create QuickBooks entry", status: "success", duration: "0.8s", log: "Created QB entry #QB-7281" },
  { id: 6, node: "Notify finance", status: "success", duration: "0.2s", log: "Posted to #finance Slack channel" },
];

const STATUS_STYLE: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
};

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ executionId: string }>;
}) {
  const { executionId } = await params;
  if (!executionId.startsWith("exec_")) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/executions" className="hover:text-slate-900">Executions</Link>
          <span>/</span>
          <span className="text-slate-900">{executionId}</span>
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Execution {executionId}</h1>
        <p className="text-sm text-slate-500">Workflow: Invoice Routing · Started 2026-11-03 09:42:11</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Status", value: "Success" },
          { label: "Duration", value: "9m 22s" },
          { label: "Trigger", value: "Schedule" },
          { label: "Started by", value: "system" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Step-by-step log</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((s) => (
            <li key={s.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${STATUS_STYLE[s.status]}`}>
                  {s.id}
                </span>
                {s.id < STEPS.length && <div className="my-1 h-8 w-px bg-slate-200" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{s.node}</p>
                  <span className="text-xs text-slate-400">{s.duration}</span>
                </div>
                <p className="mt-1 rounded-md bg-slate-50 p-2 font-mono text-xs text-slate-600">{s.log}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

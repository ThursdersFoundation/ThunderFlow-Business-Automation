import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Workflow details" };

const WORKFLOW = {
  id: "wf_001",
  name: "Invoice Routing",
  description: "Routes incoming invoices to the right approver based on amount and vendor.",
  status: "active",
  owner: "Jane Doe",
  createdAt: "2025-08-12",
  lastRun: "2m ago",
  runs: 1284,
  successRate: 99.1,
  nodes: [
    { id: "n1", type: "trigger", label: "Email received", sub: "Gmail · invoices@" },
    { id: "n2", type: "action", label: "Extract data", sub: "OCR + parser" },
    { id: "n3", type: "condition", label: "Amount > $500?", sub: "Branch" },
    { id: "n4", type: "approval", label: "Manager approval", sub: "Email + Slack" },
    { id: "n5", type: "action", label: "Create QuickBooks entry", sub: "Integration" },
    { id: "n6", type: "notification", label: "Notify finance", sub: "Slack #finance" },
  ],
};

const NODE_COLORS: Record<string, string> = {
  trigger: "border-indigo-500 text-indigo-600",
  action: "border-emerald-500 text-emerald-600",
  condition: "border-amber-500 text-amber-600",
  approval: "border-violet-500 text-violet-600",
  notification: "border-pink-500 text-pink-600",
};

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) {
  const { workflowId } = await params;
  if (workflowId !== WORKFLOW.id) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/workflows" className="hover:text-slate-900">Workflows</Link>
            <span>/</span>
            <span className="text-slate-900">{WORKFLOW.name}</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{WORKFLOW.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{WORKFLOW.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/workflows/${WORKFLOW.id}/history`} className="btn-secondary">History</Link>
          <Link href={`/workflows/${WORKFLOW.id}/edit`} className="btn-primary">Edit</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Status", value: WORKFLOW.status },
          { label: "Runs", value: WORKFLOW.runs.toLocaleString() },
          { label: "Success rate", value: `${WORKFLOW.successRate}%` },
          { label: "Owner", value: WORKFLOW.owner },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-lg font-semibold capitalize text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Workflow canvas</h2>
        <p className="mt-1 text-xs text-slate-500">A linear preview of the workflow nodes.</p>
        <ol className="mt-4 space-y-3">
          {WORKFLOW.nodes.map((n, i) => (
            <li key={n.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`rounded-md border-2 bg-white px-3 py-2 ${NODE_COLORS[n.type]}`}>
                  <p className="text-sm font-medium text-slate-900">{n.label}</p>
                  <p className="text-xs text-slate-500">{n.sub}</p>
                </div>
                {i < WORKFLOW.nodes.length - 1 && <div className="my-1 h-6 w-px bg-slate-300" />}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

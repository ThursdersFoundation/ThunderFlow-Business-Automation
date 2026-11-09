import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Approvals" };

const APPROVALS = [
  { id: "ap_201", title: "Invoice #INV-2026-0042 — $842.50", requester: "system", workflow: "Invoice Routing", requestedAt: "2m ago", priority: "high" },
  { id: "ap_200", title: "Expense report — Travel Q3", requester: "Mike Lee", workflow: "Expense Approval v2", requestedAt: "1h ago", priority: "medium" },
  { id: "ap_199", title: "Vendor contract — Acme Corp", requester: "Sarah Kim", workflow: "Contract Approval", requestedAt: "3h ago", priority: "high" },
  { id: "ap_198", title: "Time-off request — Nov 12-15", requester: "Jane Doe", workflow: "PTO Request", requestedAt: "5h ago", priority: "low" },
];

const PRIORITY_STYLE: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Approvals</h1>
        <p className="text-sm text-slate-500">{APPROVALS.length} pending approvals awaiting your review.</p>
      </div>

      <div className="space-y-3">
        {APPROVALS.map((a) => (
          <div key={a.id} className="card flex items-center justify-between p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/approvals/${a.id}`} className="font-medium text-slate-900 hover:text-indigo-600">
                  {a.title}
                </Link>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLE[a.priority]}`}>
                  {a.priority}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Requested by {a.requester} · {a.workflow} · {a.requestedAt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                Approve
              </button>
              <button className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

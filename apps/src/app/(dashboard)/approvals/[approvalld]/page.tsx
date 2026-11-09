import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Approval details" };

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ approvalId: string }>;
}) {
  const { approvalId } = await params;
  if (!approvalId.startsWith("ap_")) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/approvals" className="hover:text-slate-900">Approvals</Link>
          <span>/</span>
          <span className="text-slate-900">{approvalId}</span>
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Invoice #INV-2026-0042 — $842.50</h1>
        <p className="text-sm text-slate-500">Pending approval · Requested 2m ago by system</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Request details</h2>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["Vendor", "Acme Corp"],
              ["Invoice number", "INV-2026-0042"],
              ["Amount", "$842.50"],
              ["Currency", "USD"],
              ["Due date", "2026-11-17"],
              ["GL code", "5000 — Software"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase text-slate-500">{k}</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-900">Decision</h2>
          <textarea
            className="input mt-3"
            rows={4}
            placeholder="Add a comment (optional)…"
          />
          <div className="mt-3 space-y-2">
            <button className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Approve
            </button>
            <button className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
              Reject
            </button>
            <button className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
              Reassign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

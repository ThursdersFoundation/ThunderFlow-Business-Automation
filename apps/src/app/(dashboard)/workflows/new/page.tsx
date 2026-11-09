import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "New workflow" };

const STARTERS = [
  { id: "blank", name: "Blank workflow", body: "Start from scratch with an empty canvas.", icon: "M12 5v14M5 12h14" },
  { id: "trigger", name: "Schedule trigger", body: "Run on a cron schedule — daily, hourly, or custom.", icon: "M12 6v6l4 2" },
  { id: "webhook", name: "Webhook trigger", body: "React to incoming HTTP events from any service.", icon: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" },
  { id: "approval", name: "Approval chain", body: "Route a request through one or more approvers.", icon: "M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" },
];

export default function NewWorkflowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">New workflow</h1>
        <p className="text-sm text-slate-500">Pick a starting point. You can customize everything later.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STARTERS.map((s) => (
          <Link key={s.id} href={`/workflows/new/${s.id}`}
                className="card p-6 transition hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.body}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900">Or start from a template</h3>
        <p className="mt-1 text-sm text-slate-500">
          Browse our gallery of pre-built workflows for common business scenarios.
        </p>
        <Link href="/workflows/templates" className="btn-secondary mt-4 inline-block">
          Browse templates
        </Link>
      </div>
    </div>
  );
}

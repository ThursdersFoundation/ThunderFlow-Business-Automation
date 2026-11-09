import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Workflow templates" };

const TEMPLATES = [
  { id: "tpl_inv", name: "Invoice Routing", category: "Finance", body: "Route invoices to approvers based on amount.", uses: 1280 },
  { id: "tpl_onb", name: "Employee Onboarding", category: "HR", body: "Set up accounts, equipment, and welcome email.", uses: 980 },
  { id: "tpl_lead", name: "Lead Routing", category: "Sales", body: "Score and route inbound leads to the right rep.", uses: 760 },
  { id: "tpl_exp", name: "Expense Approval", category: "Finance", body: "Submit, review, and approve expense reports.", uses: 645 },
  { id: "tpl_tkt", name: "Support Ticket Escalation", category: "Support", body: "Escalate aged tickets to a supervisor.", uses: 520 },
  { id: "tpl_chng", name: "Change Management", category: "IT", body: "Plan, review, and deploy infrastructure changes.", uses: 410 },
  { id: "tpl_hire", name: "Hiring Pipeline", category: "HR", body: "Track candidates through interview stages.", uses: 380 },
  { id: "tpl_qa", name: "QA Release Gate", category: "Engineering", body: "Run tests and require sign-off before deploy.", uses: 290 },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Templates</h1>
        <p className="text-sm text-slate-500">Start from a pre-built workflow tailored to common business scenarios.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Finance", "HR", "Sales", "Support", "IT", "Engineering"].map((c, i) => (
          <button key={c}
                  className={`rounded-full px-3 py-1 text-sm ${i === 0 ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">{t.name}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{t.category}</span>
            </div>
            <p className="mt-2 flex-1 text-sm text-slate-500">{t.body}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">{t.uses.toLocaleString()} uses</span>
              <Link href={`/workflows/new?template=${t.id}`} className="btn-secondary text-xs">
                Use template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

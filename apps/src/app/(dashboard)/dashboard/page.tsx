import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your ThunderFlow workspace overview.",
};

const STATS = [
  { label: "Active workflows", value: "248", delta: "+12%", trend: "up" as const },
  { label: "Executions today", value: "1,284", delta: "+8%", trend: "up" as const },
  { label: "Pending approvals", value: "7", delta: "-2", trend: "down" as const },
  { label: "Success rate (30d)", value: "98.4%", delta: "+1.2%", trend: "up" as const },
];

const ACTIVITY = [
  { user: "Jane Doe", action: "approved workflow", target: "Invoice Routing #128", time: "2m ago" },
  { user: "System", action: "executed", target: "Daily Sales Sync", time: "12m ago" },
  { user: "Mike Lee", action: "edited", target: "Onboarding Flow", time: "1h ago" },
  { user: "System", action: "failed to execute", target: "Slack Notification", time: "2h ago" },
  { user: "Sarah Kim", action: "created", target: "Expense Approval v2", time: "3h ago" },
];

const TREND = [120, 180, 90, 220, 160, 260, 200, 280, 240, 310, 290, 340];

export default function DashboardPage() {
  const max = Math.max(...TREND);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Jane. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/workflows/new" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M5 12h14M12 5v14" />
          </svg>
          New workflow
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className={`mt-1 text-xs ${s.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
              {s.delta} vs last week
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Trend chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Execution trends</h2>
            <select className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs">
              <option>Last 12 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {TREND.map((v, i) => (
              <div key={i} className="flex-1 rounded-t bg-indigo-100 hover:bg-indigo-200 transition"
                   style={{ height: `${(v / max) * 100}%` }}
                   title={`${v} executions`} />
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <Image src="/images/avatars/default-avatar.png" alt="" width={28} height={28}
                       className="rounded-full" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-slate-500">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { href: "/workflows/templates", title: "Browse templates", body: "Start from a pre-built workflow." },
          { href: "/integrations", title: "Connect integrations", body: "Wire up Slack, Gmail, webhooks, and more." },
          { href: "/reports/analytics", title: "View analytics", body: "Drill into execution metrics." },
        ].map((q) => (
          <Link key={q.href} href={q.href}
                className="card p-5 transition hover:border-indigo-300 hover:shadow-md">
            <h3 className="text-sm font-semibold text-slate-900">{q.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{q.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

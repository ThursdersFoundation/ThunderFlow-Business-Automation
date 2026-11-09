import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

const NOTIFS = [
  { id: "n1", type: "approval", title: "Approval requested", body: "Invoice #INV-2026-0042 ($842.50) needs your approval.", time: "2m ago", read: false },
  { id: "n2", type: "success", title: "Workflow completed", body: "Daily Sales Sync finished in 1.4s.", time: "12m ago", read: false },
  { id: "n3", type: "error", title: "Workflow failed", body: "Slack Notification failed: invalid channel #release.", time: "1h ago", read: false },
  { id: "n4", type: "info", title: "Integration connected", body: "Google Workspace is now connected to your workspace.", time: "3h ago", read: true },
  { id: "n5", type: "mention", title: "You were mentioned", body: "Mike Lee mentioned you in Onboarding Flow.", time: "5h ago", read: true },
];

const TYPE_DOT: Record<string, string> = {
  approval: "bg-violet-500",
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  mention: "bg-amber-500",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Stay on top of what needs your attention.</p>
        </div>
        <button className="btn-secondary">Mark all as read</button>
      </div>

      <div className="card divide-y divide-slate-100">
        {NOTIFS.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-indigo-50/40" : ""}`}>
            <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${TYPE_DOT[n.type]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{n.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
            </div>
            <span className="text-xs text-slate-400">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

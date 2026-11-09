import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notification preferences" };

const CHANNELS = ["Email", "Slack", "Mobile push"];
const EVENTS = [
  "Workflow completed successfully",
  "Workflow failed",
  "Approval requested",
  "Approval decision made",
  "Mention in comment",
  "Weekly summary report",
  "Integration disconnected",
  "Billing alerts",
];

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
      <p className="text-sm text-slate-500">Choose which events trigger notifications, and where they&apos;re delivered.</p>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              {CHANNELS.map((c) => (
                <th key={c} className="px-4 py-3 text-center font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EVENTS.map((e, i) => (
              <tr key={e} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{e}</td>
                {CHANNELS.map((c, j) => (
                  <td key={c} className="px-4 py-3 text-center">
                    <input type="checkbox" defaultChecked={i % 2 === 0 || j === 0}
                           className="h-4 w-4 rounded border-slate-300" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save preferences</button>
      </div>
    </div>
  );
}

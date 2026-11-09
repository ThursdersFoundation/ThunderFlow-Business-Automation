import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing" };

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Billing</h1>

      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Current plan</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">Business</p>
            <p className="mt-1 text-sm text-slate-500">$99 / month · renews on 2026-12-01</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Change plan</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Workflow executions", used: 12840, total: 50000 },
            { label: "Active workflows", used: 248, total: 500 },
            { label: "Team members", used: 12, total: 25 },
          ].map((u) => {
            const pct = Math.min(100, (u.used / u.total) * 100);
            return (
              <div key={u.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{u.label}</span>
                  <span className="text-slate-500">{u.used.toLocaleString()} / {u.total.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Payment method</h2>
        <div className="mt-3 flex items-center justify-between rounded-md border border-slate-200 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-900 text-xs font-bold text-white">VISA</div>
            <div>
              <p className="text-sm font-medium text-slate-900">•••• 4242</p>
              <p className="text-xs text-slate-500">Expires 08/2028</p>
            </div>
          </div>
          <button className="btn-secondary">Update</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent invoices</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["2026-11-01", "$99.00", "Paid"],
              ["2026-10-01", "$99.00", "Paid"],
              ["2026-09-01", "$99.00", "Paid"],
            ].map((row) => (
              <tr key={row[0]} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{row[0]}</td>
                <td className="px-4 py-3 text-slate-600">{row[1]}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                    {row[2]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-indigo-600 hover:text-indigo-700">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

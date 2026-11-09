import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security settings" };

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Security</h1>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Password</h2>
        <div className="mt-4 max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Current password</label>
            <input type="password" className="input mt-1" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">New password</label>
            <input type="password" className="input mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm new password</label>
            <input type="password" className="input mt-1" />
          </div>
          <button className="btn-primary">Update password</button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Two-factor authentication</h2>
            <p className="mt-1 text-sm text-slate-500">Add an extra layer of security with an authenticator app.</p>
          </div>
          <button className="btn-primary">Enable 2FA</button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Active sessions</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {[
            { device: "Chrome on macOS", location: "Jakarta, ID", current: true, lastActive: "Now" },
            { device: "Safari on iPhone", location: "Jakarta, ID", current: false, lastActive: "2h ago" },
            { device: "Firefox on Windows", location: "Singapore", current: false, lastActive: "3d ago" },
          ].map((s) => (
            <li key={s.device} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">
                  {s.device}
                  {s.current && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Current</span>}
                </p>
                <p className="text-xs text-slate-500">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current && (
                <button className="text-xs text-red-600 hover:text-red-700">Revoke</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

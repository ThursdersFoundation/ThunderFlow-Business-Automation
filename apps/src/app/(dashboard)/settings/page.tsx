import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Settings" };

const SECTIONS = [
  { href: "/settings/profile", title: "Profile", body: "Your name, email, and avatar." },
  { href: "/settings/security", title: "Security", body: "Password, two-factor auth, active sessions." },
  { href: "/settings/notifications", title: "Notifications", body: "Choose what you get notified about and how." },
  { href: "/settings/billing", title: "Billing", body: "Plan, payment method, invoices, usage." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}
                className="card p-5 transition hover:border-indigo-300 hover:shadow-md">
            <h2 className="font-semibold text-slate-900">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{s.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

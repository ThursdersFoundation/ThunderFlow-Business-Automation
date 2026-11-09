import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Team</h1>
        <p className="text-sm text-slate-500">Manage your ThunderFlow workspace team.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Members", value: "12" },
          { label: "Pending invites", value: "3" },
          { label: "Roles configured", value: "4" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Roles & permissions</h2>
          <Link href="/team/members" className="btn-secondary">Manage members</Link>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2 font-medium">Role</th>
              <th className="py-2 font-medium">Members</th>
              <th className="py-2 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ["Owner", "1", "Full access, billing, delete workspace"],
              ["Admin", "2", "Manage members, all workflows"],
              ["Editor", "6", "Create & edit workflows"],
              ["Viewer", "3", "Read-only access"],
            ].map((row) => (
              <tr key={row[0]}>
                <td className="py-2 font-medium text-slate-900">{row[0]}</td>
                <td className="py-2 text-slate-600">{row[1]}</td>
                <td className="py-2 text-slate-500">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

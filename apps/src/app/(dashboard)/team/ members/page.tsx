import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Team members" };

const MEMBERS = [
  { name: "Jane Doe", email: "jane@acme.com", role: "Owner", status: "active", lastActive: "now" },
  { name: "Mike Lee", email: "mike@acme.com", role: "Admin", status: "active", lastActive: "5m ago" },
  { name: "Sarah Kim", email: "sarah@acme.com", role: "Admin", status: "active", lastActive: "1h ago" },
  { name: "Tom Park", email: "tom@acme.com", role: "Editor", status: "active", lastActive: "2h ago" },
  { name: "Lisa Wong", email: "lisa@acme.com", role: "Editor", status: "invited", lastActive: "—" },
  { name: "Bob Chen", email: "bob@acme.com", role: "Viewer", status: "active", lastActive: "1d ago" },
];

export default function TeamMembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Members</h1>
          <p className="text-sm text-slate-500">{MEMBERS.length} members in your workspace.</p>
        </div>
        <button className="btn-primary">Invite member</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MEMBERS.map((m) => (
              <tr key={m.email} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image src="/images/avatars/default-avatar.png" alt="" width={32} height={32}
                           className="rounded-full" />
                    <div>
                      <p className="font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-500">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select defaultValue={m.role}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs">
                    <option>Owner</option>
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{m.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs text-red-600 hover:text-red-700">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

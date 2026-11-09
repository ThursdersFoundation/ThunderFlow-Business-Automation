import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Profile settings" };

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Avatar</h2>
        <div className="mt-4 flex items-center gap-4">
          <Image src="/images/avatars/default-avatar.png" alt="" width={64} height={64}
                 className="rounded-full" />
          <div>
            <button className="btn-secondary">Upload new</button>
            <p className="mt-1 text-xs text-slate-500">PNG or JPG, up to 2 MB.</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-900">Personal information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input className="input mt-1" defaultValue="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input className="input mt-1" defaultValue="jane@acme.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <input className="input mt-1" defaultValue="Engineering Manager" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Timezone</label>
            <select className="input mt-1" defaultValue="Asia/Jakarta">
              <option>Asia/Jakarta</option>
              <option>Asia/Singapore</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}

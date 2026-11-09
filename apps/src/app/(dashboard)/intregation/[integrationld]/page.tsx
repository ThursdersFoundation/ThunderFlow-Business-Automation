import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Integration details" };

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ integrationId: string }>;
}) {
  const { integrationId } = await params;
  if (!integrationId.startsWith("int_")) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Image src="/images/integrations/slack.png" alt="Slack" width={56} height={56} className="rounded-md" />
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/integrations" className="hover:text-slate-900">Integrations</Link>
            <span>/</span>
            <span className="text-slate-900">Slack</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Slack</h1>
          <p className="text-sm text-slate-500">Send messages, create channels, and react to events in Slack.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Configuration</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Workspace</label>
              <input className="input mt-1" defaultValue="acme.slack.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Bot token</label>
              <input type="password" className="input mt-1" defaultValue="xoxb-••••••••••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Default channel</label>
              <input className="input mt-1" defaultValue="#general" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Sign incoming requests</p>
                <p className="text-xs text-slate-500">Verify Slack signing secret on every webhook.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
            </div>
            <button className="btn-primary">Save configuration</button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-900">Status</h2>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Connection</span>
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Last event</span>
              <span className="text-slate-900">2m ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Events (24h)</span>
              <span className="text-slate-900">1,284</span>
            </div>
          </div>
          <button className="btn-secondary mt-4 w-full">Disconnect</button>
        </div>
      </div>
    </div>
  );
}

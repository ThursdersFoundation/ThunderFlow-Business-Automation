import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = { title: "Integrations" };

const INTEGRATIONS = [
  { id: "int_slack", name: "Slack", category: "Communication", connected: true, icon: "/images/integrations/slack.png" },
  { id: "int_google", name: "Google Workspace", category: "Productivity", connected: true, icon: "/images/integrations/google.png" },
  { id: "int_microsoft", name: "Microsoft 365", category: "Productivity", connected: false, icon: "/images/integrations/microsoft.png" },
  { id: "int_discord", name: "Discord", category: "Communication", connected: false, icon: "/images/integrations/discord.png" },
  { id: "int_email", name: "Email (SMTP)", category: "Communication", connected: true, icon: "/images/integrations/email.png" },
  { id: "int_webhook", name: "Webhooks", category: "Developer", connected: true, icon: "/images/integrations/webhook.png" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Integrations</h1>
        <p className="text-sm text-slate-500">Connect ThunderFlow to the tools your team already uses.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((i) => (
          <div key={i.id} className="card p-5">
            <div className="flex items-start gap-3">
              <Image src={i.icon} alt={i.name} width={40} height={40} className="rounded-md" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900">{i.name}</h3>
                <p className="text-xs text-slate-500">{i.category}</p>
              </div>
              {i.connected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Connected
                </span>
              )}
            </div>
            <Link href={`/integrations/${i.id}`}
                  className={`mt-4 block rounded-md px-3 py-1.5 text-center text-sm font-medium ${
                    i.connected
                      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}>
              {i.connected ? "Manage" : "Connect"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

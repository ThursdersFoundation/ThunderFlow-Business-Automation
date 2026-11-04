import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Image src="/logo.svg" alt="ThunderFlow" width={180} height={40} priority />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/features" className="text-slate-600 hover:text-slate-900">Features</Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/docs" className="text-slate-600 hover:text-slate-900">Docs</Link>
            <Link href="/login" className="text-slate-600 hover:text-slate-900">Sign in</Link>
            <Link href="/register" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/hero-background.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Automate the work that<br />
            <span className="text-indigo-600">slows your team down</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            ThunderFlow turns repetitive business processes into visual workflows
            with built-in approvals, integrations, and real-time analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register" className="rounded-md bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition">
              Start free
            </Link>
            <Link href="/login" className="rounded-md border border-slate-300 bg-white px-6 py-3 text-slate-900 font-medium hover:bg-slate-50 transition">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Visual workflow builder", body: "Drag-and-drop triggers, conditions, and actions. No code required." },
          { title: "Built-in approvals", body: "Route work to the right people. Get notified in Slack or email." },
          { title: "Real-time analytics", body: "Track every execution. Spot bottlenecks before they cost you." },
        ].map((f) => (
          <div key={f.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-slate-600">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Thunders Robotic. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/status">Status</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

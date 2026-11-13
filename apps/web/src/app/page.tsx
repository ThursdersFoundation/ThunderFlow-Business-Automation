import type { Metadata } from "next";
import Link from "next/link";
import  {
  ArrowRight,
  GitBranch,
  LayoutTemplate,
  ShieldCheck,
  Zap,
  Workflow,
  Clock,
  LineChart,
  Bell,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
   title: "Home",
  description:
    "ThunderFlow automates approvals, document routing, integrations " +
    "and notifications on one visual, low-code platform built for operations " +
    "and finance teams.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: Workflow,
    title: "Visual workflow builder",
    description:
      "Drag-and-drop nodes for triggers, conditions, approvals and actions. " +
      "Model any business process in minutes — no code, no consultants.",
  },
  {
    icon: GitBranch,
    title: "Conditional branching",
    description:
      "Route work by amount, department, risk score or custom rules. " +
      "Parallel branches and fallback paths keep every case moving.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready approvals",
    description:
      "Four-eyes review, delegation and SLA timers with a full immutable " +
      "audit trail that satisfies SOX and SOC 2 reviewers.",
  },
  {
    icon: Plug,
    title: "200+ integrations",
    description:
      "Connect SAP, Oracle NetSuite, Salesforce, Slack, DocuSign and your " +
      "internal APIs through pre-built connectors or webhooks.",
  },
  {
    icon: Clock,
    title: "SLA & scheduling",
    description:
      "Escalate overdue tasks automatically, run jobs on a cron and never " +
      "lose a case to a forgotten inbox again.",
  },
  {
    icon: Bell,
    title: "Smart notifications",
    description:
      "Context-aware alerts across email, Slack, Teams and mobile push. " +
      "Digest mode keeps inboxes quiet without missing what matters.",
  },
] as const;

const STATS = [
  { value: "92%", label: "Median cycle-time reduction" },
  { value: "10k+", label: "Workflows run every day" },
  { value: "200+", label: "Pre-built integrations" },
  { value: "99.95%", label: "Platform uptime SLA" },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Map the process",
    body: "Sketch approvals, hand-offs and systems on a canvas. Import a BPMN " +
      "file or describe the flow and let ThunderFlow draft the first version.",
  },
  {
    step: "02",
    title: "Connect your stack",
    body: "Bind nodes to ERP, CRM, email and document systems. Credentials are " +
      "stored in a managed vault and rotated automatically.",
  },
  {
    step: "03",
    title: "Run & monitor",
    body: "Publish, then watch live cases move through the pipeline. Catch " +
      "bottlenecks with per-node analytics before they become escalations.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="tf-fade-in">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]"
        />
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <Badge variant="secondary" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            New · Process copilot in private beta
          </Badge>

          <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Automate the workflows that run{" "}
            <span className="text-primary">your business</span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            ThunderFlow turns manual approvals, document routing and system
            hand-offs into resilient, auditable automations — without writing
            glue code or hiring consultants.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                Start automating
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/demo">Book a live demo</Link>
            </Button>
          </div>

          <dl className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-1">
                <dt className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything an operations team needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            A single platform for designing, running and governing the
            automations that sit between your people and your systems.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="group rounded-lg border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md",
                  "bg-primary/10 text-primary",
                )}
              >
                <feature.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">
              <LayoutTemplate className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              From idea to production
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ship your first automation this week
            </h2>
          </div>

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <li
                key={s.step}
                className="relative rounded-lg border bg-background p-6"
              >
                <span className="font-display text-4xl font-bold text-primary/30">
                  {s.step}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href="/docs/quickstart">
                Read the quickstart
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- Analytics teaser ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              <LineChart className="h-4 w-4 text-primary" aria-hidden />
              Process analytics
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              See bottlenecks before they become escalations
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every node reports throughput, wait time and exception rate. Pin
              the dashboards your reviewers care about, set thresholds, and let
              ThunderFlow open the ticket when a stage drifts out of SLA.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Per-node cycle time and wait time",
                "Exception and rework heatmaps",
                "SLA breach forecasts and auto-escalation",
                "Exportable audit logs for compliance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Purchase-order approvals
              </span>
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </div>
            <div className="mt-4 flex h-40 items-end gap-2">
              {[40, 65, 52, 78, 60, 88, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/80"
                  style={{ height: `${h}%` }}
                  aria-hidden
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12 lg:p-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Replace busywork with reliable automation
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Start free. Connect a sandbox. Ship a workflow in an afternoon
                and let your team focus on the work that actually needs them.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">
                    Create a free account
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

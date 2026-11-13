import type { MetadataRoute } from "next";

/**
 * ThunderFlow — sitemap.xml generator.
 *
 * Served at /sitemap.xml by Next.js. Includes the public, indexable
 * surfaces only; authenticated app routes are excluded (see robots.ts) and
 * should never appear here.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.thunderflow.io";

function entry(path: string, opts?: Partial<MetadataRoute.Sitemap[number]>) {
  return {
    url: `${appUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    ...opts,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const topLevel: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "weekly", priority: 1.0 }),
    entry("/pricing", { changeFrequency: "monthly", priority: 0.8 }),
    entry("/customers", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/about", { changeFrequency: "yearly", priority: 0.5 }),
    entry("/contact", { changeFrequency: "yearly", priority: 0.5 }),
    entry("/careers", { changeFrequency: "weekly", priority: 0.6 }),
    entry("/security", { changeFrequency: "yearly", priority: 0.6 }),
    entry("/status", { changeFrequency: "hourly", priority: 0.4 }),
  ];

  const legal: MetadataRoute.Sitemap = [
    entry("/legal/privacy", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/legal/terms", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/legal/dpa", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/legal/subprocessors", { changeFrequency: "yearly", priority: 0.3 }),
  ];

  // Marketing solution pages — one per persona / use case.
  const solutions: MetadataRoute.Sitemap = [
    entry("/solutions/finance-automation", {
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    entry("/solutions/procurement", {
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    entry("/solutions/hr-onboarding", {
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    entry("/solutions/customer-ops", {
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    entry("/solutions/legal-routing", {
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  ].map((e) => ({ ...e, lastModified: now }));

  // Docs section — refresh often, lower per-page priority.
  const docs: MetadataRoute.Sitemap = [
    "/docs",
    "/docs/quickstart",
    "/docs/concepts/workflows",
    "/docs/concepts/triggers",
    "/docs/concepts/approvals",
    "/docs/integrations",
    "/docs/api-reference",
    "/docs/changelog",
  ].map((p) =>
    entry(p, { changeFrequency: "weekly", priority: 0.6, lastModified: now }),
  );

  const blog: MetadataRoute.Sitemap = [
    entry("/blog", { changeFrequency: "daily", priority: 0.6 }),
    ...BLOG_SLUGS.map((slug) =>
      entry(`/blog/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.5,
        lastModified: now,
      }),
    ),
  ];

  return [...topLevel, ...legal, ...solutions, ...docs, ...blog];
}

// In production this would be fetched from the CMS; a small static list keeps
// the route self-contained and deterministic at build time.
const BLOG_SLUGS = [
  "reducing-approval-cycle-time",
  "no-code-vs-rpa",
  "audit-trail-best-practices",
  "integrating-sap-with-low-code",
  "sla-escalation-patterns",
];

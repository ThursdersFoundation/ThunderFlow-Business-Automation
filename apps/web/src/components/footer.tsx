import * as React from "react";
import Link from "next/link";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Footer — public marketing footer for ThunderFlow.
 *
 * Brand blurb on the left, four link columns (Product, Solutions, Resources,
 * Company) in the middle, legal + socials on the bottom row. Self-contained:
 * no client JS, so it stays fast and SSR-friendly.
 */

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/docs/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Finance automation", href: "/solutions/finance-automation" },
      { label: "Procurement", href: "/solutions/procurement" },
      { label: "HR onboarding", href: "/solutions/hr-onboarding" },
      { label: "Customer ops", href: "/solutions/customer-ops" },
      { label: "Legal routing", href: "/solutions/legal-routing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "API reference", href: "/docs/api-reference" },
      { label: "Blog", href: "/blog" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers" },
      { label: "Careers", href: "/careers" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { label: "Twitter", href: "https://twitter.com/thunderflow", icon: Twitter },
  { label: "GitHub", href: "https://github.com/thunderflow", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/thunderflow",
    icon: Linkedin,
  },
] as const;

const LEGAL: FooterLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "DPA", href: "/legal/dpa" },
  { label: "Subprocessors", href: "/legal/subprocessors" },
  { label: "Status", href: "/status" },
];

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Hide the link columns, keep the brand + legal bar (default false). */
  compact?: boolean;
}

export function Footer({ compact = false, className, ...props }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn("border-t bg-background", className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand blurb */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" aria-hidden />
              </span>
              <span>ThunderFlow</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The visual, low-code platform for automating the workflows that
              run your business — approvals, document routing, integrations and
              notifications on one auditable surface.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <s.icon className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {!compact ? (
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8"
            >
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h2 className="text-sm font-semibold text-foreground">
                    {col.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          ) : null}
        </div>

        {/* Legal bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} ThunderFlow, Inc. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

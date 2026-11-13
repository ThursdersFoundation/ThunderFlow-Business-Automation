import * as React from "react";
import Link from "next/link";
import { Zap, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Header — public / marketing site header.
 *
 * Distinct from the authenticated app Navbar: this is the top bar for the
 * marketing pages (landing, pricing, docs, blog). It has the brand mark, a
 * primary nav, a theme toggle slot, and sign-in / sign-up CTAs. The mobile
 * menu is intentionally left as a simple disclosure for the parent to wire up.
 */

interface NavLink {
  label: string;
  href: string;
}

const PRIMARY_NAV: NavLink[] = [
  { label: "Product", href: "/#features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Render a slimmer sticky variant (default true). */
  sticky?: boolean;
  /** Show the sign-in / sign-up actions on the right (default true). */
  showActions?: boolean;
}

export function Header({
  sticky = true,
  showActions = true,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "z-30 w-full border-b bg-background/80 backdrop-blur",
        sticky && "sticky top-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" aria-hidden />
          </span>
          <span>ThunderFlow</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          {showActions ? (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          ) : null}

          {/* Mobile menu trigger — wire up an off-canvas drawer in the parent. */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
    </header>
  );
}

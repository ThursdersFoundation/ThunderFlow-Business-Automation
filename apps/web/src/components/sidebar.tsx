"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  Activity,
  Plug,
  Users,
  Settings,
  BookOpen,
  Zap,
  ChevronsLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Sidebar — primary navigation rail for the ThunderFlow app shell.
 *
 * - Fixed on `lg` and wider; collapses to an off-canvas drawer on mobile
 *   (toggled via the `open` / `onOpenChange` props controlled by the parent).
 * - Highlights the active route via `usePathname` and exact / startsWith match.
 * - Uses the `--sidebar-*` tokens from globals.css so it reads as a dark rail
 *   even in light mode.
 */

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match the active state by exact equality (default: startsWith). */
  exact?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, exact: true },
      { label: "Workflows", href: "/workflows", icon: Workflow, badge: "12" },
      { label: "Activity", href: "/activity", icon: Activity },
      { label: "Integrations", href: "/integrations", icon: Plug },
    ],
  },
  {
    title: "Manage",
    items: [
      { label: "Team", href: "/team", icon: Users },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Docs", href: "/docs", icon: BookOpen },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function isActive(pathname: string | null, href: string, exact?: boolean) {
  if (!pathname) return false;
  return exact ? pathname === href : pathname.startsWith(href);
}

export function Sidebar({ open = false, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile scrim */}
      <div
        aria-hidden
        onClick={() => onOpenChange?.(false)}
        className={cn(
          "fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden",
          open ? "block" : "hidden",
        )}
      />

      <aside
        aria-label="Primary"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Zap className="h-4 w-4" aria-hidden />
            </span>
            <span>ThunderFlow</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
            onClick={() => onOpenChange?.(false)}
          >
            <ChevronsLeft className="h-5 w-5" aria-hidden />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        )}
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0"
                          aria-hidden
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer slot */}
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-md bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/70">
            <p className="font-semibold text-sidebar-foreground">
              Need a hand?
            </p>
            <p className="mt-1">
              Browse the docs or ping support from the command palette.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

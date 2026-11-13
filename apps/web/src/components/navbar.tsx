"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  HelpCircle,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Command as CommandIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
} from "@/components/ui/dropdown";
import { ThemeToggle } from "@/components/providers/theme-provider";

/**
 * Navbar (Topbar) — horizontal header bar across the ThunderFlow app.
 *
 * Left:  mobile menu trigger + breadcrumb / page title slot.
 * Middle: global search (opens the command palette).
 * Right:  quick actions, theme toggle, notifications, user menu.
 *
 * The sidebar open state is controlled by the parent so the navbar and
 * sidebar stay in sync.
 */
interface NavbarProps {
  /** Title or breadcrumb shown on the left (desktop). */
  title?: string;
  /** Sidebar open state (mobile drawer). */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Currently signed-in user. */
  user?: { name: string; email: string; avatarUrl?: string | null };
}

function dispatchCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}

export function Navbar({
  title = "ThunderFlow",
  sidebarOpen = false,
  onSidebarOpenChange,
  user = { name: "Ada Lovelace", email: "ada@thunderflow.io" },
}: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur sm:px-6",
      )}
    >
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={sidebarOpen}
        onClick={() => onSidebarOpenChange?.(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" aria-hidden />
      </Button>

      <h1 className="font-display text-lg font-semibold tracking-tight">
        {title}
      </h1>

      {/* Search / command palette trigger */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={dispatchCommandPalette}
          className={cn(
            "hidden items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:flex",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label="Open command palette"
        >
          <Search className="h-4 w-4" aria-hidden />
          <span>Search…</span>
          <kbd className="ml-6 inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <CommandIcon className="h-3 w-3" aria-hidden />K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
          onClick={dispatchCommandPalette}
        >
          <Search className="h-5 w-5" aria-hidden />
        </Button>

        <Button size="sm" className="hidden sm:inline-flex" asChild>
          <Link href="/workflows/new">
            <Plus className="h-4 w-4" aria-hidden />
            New
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="hidden sm:inline-flex"
        >
          <HelpCircle className="h-5 w-5" aria-hidden />
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" aria-hidden />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User menu */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button
              type="button"
              className="ml-1 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Account menu"
            >
              <Avatar
                src={user.avatarUrl ?? null}
                name={user.name}
                alt={user.name}
                size="sm"
              />
            </button>
          </DropdownTrigger>
          <DropdownContent align="end" className="w-60">
            <DropdownLabel>
              <span className="block text-sm font-semibold text-foreground">
                {user.name}
              </span>
              <span className="block text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </DropdownLabel>
            <DropdownSeparator />
            <DropdownGroup>
              <DropdownItem asChild>
                <Link href="/profile">
                  <UserIcon aria-hidden />
                  Profile
                </Link>
              </DropdownItem>
              <DropdownItem asChild>
                <Link href="/settings">
                  <SettingsIcon aria-hidden />
                  Settings
                </Link>
              </DropdownItem>
            </DropdownGroup>
            <DropdownSeparator />
            <DropdownItem variant="destructive" asChild>
              <Link href="/logout">
                <LogOut aria-hidden />
                Sign out
              </Link>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}

/** Backwards-compatible alias — the root layout imports `Topbar`. */
export const Topbar = Navbar;

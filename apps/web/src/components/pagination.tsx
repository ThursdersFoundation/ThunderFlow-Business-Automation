"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Pagination — page navigation control.
 *
 * Renders a compact range around the current page with leading/trailing
 * ellipses (the `…` pattern). Numbered buttons call `onPageChange`. The
 * component is controlled: the parent owns `page` and `totalPages`.
 *
 * Keyboard: arrow buttons are real <button>s; numbers carry an `aria-current`
 * on the active page so screen readers announce position.
 */

type Page = number | "ellipsis";

function buildRange(current: number, total: number): Page[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Always show first and last; show a window around current.
  const first = 1;
  const last = total;
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  const pages: Page[] = [first];
  if (left > 2) pages.push("ellipsis");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("ellipsis");
  pages.push(last);
  return pages;
}

interface PaginationProps extends React.HTMLAttributes<HTMLNavElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Disable the previous/next buttons when at the ends (default true). */
  clampAtEnds?: boolean;
  /** Accessible label for the nav element. */
  ariaLabel?: string;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  clampAtEnds = true,
  ariaLabel = "Pagination",
  className,
  ...props
}: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);
  const pages = buildRange(safePage, safeTotal);

  const prevDisabled = clampAtEnds && safePage <= 1;
  const nextDisabled = clampAtEnds && safePage >= safeTotal;

  const goTo = (p: number) => {
    if (p < 1 || p > safeTotal || p === safePage) return;
    onPageChange(p);
  };

  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <button
        type="button"
        onClick={() => goTo(safePage - 1)}
        disabled={prevDisabled}
        aria-label="Previous page"
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-2.5 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="sr-only sm:not-sr-only sm:ml-1 sm:pr-1">Prev</span>
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((p, idx) => {
          const key = p === "ellipsis" ? `ellipsis-${idx}` : `page-${p}`;
          if (p === "ellipsis") {
            return (
              <li key={key} aria-hidden>
                <span className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </li>
            );
          }
          const isActive = p === safePage;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => goTo(p)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${p}${isActive ? ", current" : ""}`}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {p}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => goTo(safePage + 1)}
        disabled={nextDisabled}
        aria-label="Next page"
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-2.5 text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        <span className="sr-only sm:not-sr-only sm:mr-1 sm:pl-1">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}

export { Pagination };

/**
 * ThunderFlow — route loading UI.
 *
 * Shown automatically by the Next.js App Router while a route segment is
 * loading. Uses the brand skeleton utility from globals.css so the visual
 * matches the rest of the app and the layout does not jump on resolve.
 */
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading ThunderFlow content"
      className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8"
    >
      <span className="sr-only">Loading…</span>

      {/* Hero skeleton */}
      <div className="space-y-4">
        <div className="tf-skeleton h-6 w-40 rounded-full" />
        <div className="tf-skeleton h-12 w-3/4 rounded-md" />
        <div className="tf-skeleton h-12 w-1/2 rounded-md" />
        <div className="tf-skeleton h-5 w-2/3 rounded-md" />
        <div className="flex gap-3 pt-2">
          <div className="tf-skeleton h-11 w-40 rounded-md" />
          <div className="tf-skeleton h-11 w-36 rounded-md" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="tf-skeleton h-8 w-20 rounded-md" />
            <div className="tf-skeleton h-4 w-28 rounded-md" />
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-6">
            <div className="tf-skeleton h-11 w-11 rounded-md" />
            <div className="tf-skeleton h-5 w-2/3 rounded-md" />
            <div className="tf-skeleton h-4 w-full rounded-md" />
            <div className="tf-skeleton h-4 w-5/6 rounded-md" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Building your workspace…
      </div>
    </div>
  );
}

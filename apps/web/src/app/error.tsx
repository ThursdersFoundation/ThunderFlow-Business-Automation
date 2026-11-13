"use client";

/**
 * ThunderFlow — route error boundary.
 *
 * Rendered by the App Router when a server component (or a child route) in
 * the SAME segment tree throws. Because it stays inside the root layout,
 * it can reuse providers, fonts and theme — only the children slot is
 * replaced. Must be a client component (Next.js requirement).
 */
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to your observability stack (Sentry, Datadog, Logflare, …).
    // Kept as a console call here so the handler is obvious and safe.
    // eslint-disable-next-line no-console
    console.error("[ThunderFlow] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" aria-hidden />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          We hit an unexpected error while loading this part of ThunderFlow.
          Your data is safe — try again, and if it keeps happening our team is
          already watching the logs.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} size="lg">
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="/">Back to dashboard</a>
        </Button>
      </div>

      {error.digest ? (
        <p className="text-xs text-muted-foreground">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
    </div>
  );
}

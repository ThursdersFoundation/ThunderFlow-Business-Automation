import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The ThunderFlow page you were looking for could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-8 px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="font-display text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">
          404
        </p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          This workflow ran off the canvas
        </h1>
        <p className="text-muted-foreground">
          The page you were looking for doesn&apos;t exist, may have been
          moved, or you might not have access to it yet.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden />
            Back to dashboard
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/search">
            <Search className="mr-2 h-4 w-4" aria-hidden />
            Search ThunderFlow
          </Link>
        </Button>
      </div>

      <nav aria-label="Popular pages" className="w-full border-t pt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Popular pages
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <li>
            <Link href="/workflows" className="hover:text-primary">
              Workflows
            </Link>
          </li>
          <li>
            <Link href="/integrations" className="hover:text-primary">
              Integrations
            </Link>
          </li>
          <li>
            <Link href="/docs" className="hover:text-primary">
              Documentation
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/status" className="hover:text-primary">
              Status
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

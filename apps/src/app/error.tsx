"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-600">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-slate-400">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-50 transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

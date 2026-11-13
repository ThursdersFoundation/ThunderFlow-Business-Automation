"use client";

/**
 * ThunderFlow — global error boundary.
 *
 * Replaces the ENTIRE document when a critical error escapes the root layout,
 * so it MUST render its own <html> and <body> and cannot rely on any provider,
 * font, or shared component. Keep everything inline and dependency-free.
 */
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[ThunderFlow] global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ThunderFlow — Application error</title>
        <style
          // Inline so this page renders even when the global stylesheet
          // failed to load. Mirrors the brand palette from globals.css.
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                color-scheme: light dark;
              }
              body {
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                  Roboto, Helvetica, Arial, sans-serif;
                background: #f8fafc;
                color: #0f172a;
              }
              @media (prefers-color-scheme: dark) {
                body { background: #0b1020; color: #f1f5f9; }
                .card { background: #111627; border-color: #1f2a44; }
                .muted { color: #94a3b8; }
                .btn-ghost { color: #cbd5e1; border-color: #1f2a44; }
              }
              .card {
                max-width: 540px;
                width: 100%;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 32px;
                background: #ffffff;
              }
              .icon {
                width: 56px; height: 56px;
                border-radius: 999px;
                display: inline-flex; align-items: center; justify-content: center;
                background: rgba(219, 39, 119, 0.12);
                color: #db2777;
                margin-bottom: 16px;
              }
              h1 { font-size: 22px; margin: 0 0 8px; font-weight: 700; }
              p  { font-size: 15px; line-height: 1.55; margin: 0 0 8px; }
              .muted { color: #64748b; }
              .actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
              .btn, .btn-ghost {
                appearance: none; cursor: pointer;
                font: inherit; font-weight: 600;
                padding: 10px 18px; border-radius: 8px;
                border: 1px solid transparent;
                text-decoration: none; display: inline-flex;
                align-items: center; gap: 8px;
              }
              .btn {
                background: #6d28d9; color: #ffffff;
              }
              .btn:hover { background: #5b21b6; }
              .btn-ghost {
                background: transparent;
                color: #475569;
                border: 1px solid #e2e8f0;
              }
              .ref { font-size: 12px; margin-top: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
            `,
          }}
        />
      </head>
      <body>
        <main className="card" role="alert" aria-live="assertive">
          <span className="icon" aria-hidden>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>

          <h1>ThunderFlow hit a critical error</h1>
          <p>
            The application could not start. Your work is safe on our servers —
            this is a problem with the page shell, not your data.
          </p>
          <p className="muted">
            Reloading usually fixes it. If the error keeps happening, our team
            is already investigating and will post updates on the status page.
          </p>

          <div className="actions">
            <button type="button" className="btn" onClick={reset}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Try again
            </button>
            <a className="btn-ghost" href="/">
              Go to homepage
            </a>
            <a
              className="btn-ghost"
              href="https://status.thunderflow.io"
              rel="noopener noreferrer"
            >
              Status page
            </a>
          </div>

          {error.digest ? (
            <p className="ref muted">Reference: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  );
}

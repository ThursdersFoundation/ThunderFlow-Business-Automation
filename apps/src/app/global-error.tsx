"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          backgroundColor: "#f8fafc",
          color: "#0f172a",
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>
            Application error
          </h1>
          <p style={{ color: "#475569", textAlign: "center", maxWidth: 480 }}>
            A critical error occurred while rendering this page.
            {error.message && ` (${error.message})`}
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

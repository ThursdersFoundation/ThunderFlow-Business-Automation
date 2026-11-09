"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Reset failed. The link may have expired.");
      }
      router.push("/login?reset=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Invalid reset link</h1>
        <p className="text-sm text-slate-500">
          The reset link is missing or malformed. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-block">
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose a strong password for your ThunderFlow account.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">New password</label>
          <input id="password" type="password" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="input mt-1" placeholder="At least 8 characters" />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">Confirm password</label>
          <input id="confirm" type="password" required minLength={8}
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="input mt-1" placeholder="Re-enter password" />
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </div>
  );
}

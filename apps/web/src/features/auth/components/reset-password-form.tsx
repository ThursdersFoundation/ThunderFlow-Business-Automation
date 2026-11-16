"use client";

/**
 * ResetPasswordForm — set a new password using a token from email.
 * The token arrives as a URL query param (`?token=...`) and is validated
 * server-side. The form re-validates locally for fast feedback.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, Lock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "../schemas/auth-schema";
import { authService } from "../services/auth-service";

interface ResetPasswordFormProps {
  token: string;
  className?: string;
}

const RULES = [
  { label: "12+ characters", test: (v: string) => v.length >= 12 },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Symbol", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
];

export function ResetPasswordForm({ token, className }: ResetPasswordFormProps) {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setServerError(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const parsed = resetPasswordSchema.safeParse({ ...form, token });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPassword(parsed.data);
      setDone(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not reset the password. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className={cn("space-y-4 text-center", className)}>
        <h2 className="text-xl font-semibold">Password updated</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Button asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-5", className)} noValidate>
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1.5">
        <label htmlFor="reset-password" className="text-sm font-medium text-foreground">
          New password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            aria-invalid={Boolean(errors.password)}
            className="pl-9"
            required
          />
        </div>
        {form.password ? (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs">
            {RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li
                  key={r.label}
                  className={cn(
                    "flex items-center gap-1",
                    ok ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <Check className={cn("size-3", ok ? "opacity-100" : "opacity-30")} aria-hidden />
                  {r.label}
                </li>
              );
            })}
          </ul>
        ) : null}
        {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="reset-confirm" className="text-sm font-medium text-foreground">
          Confirm new password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
            className="pl-9"
            required
          />
        </div>
        {errors.confirmPassword ? (
          <p className="text-xs text-destructive">{errors.confirmPassword}</p>
        ) : null}
      </div>

      {serverError ? (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{serverError}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Resetting…
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}

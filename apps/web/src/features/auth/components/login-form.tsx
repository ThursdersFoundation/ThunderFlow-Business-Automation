"use client";

/**
 * LoginForm — email/password sign-in with optional 2FA challenge step.
 * Uses the shadcn-style `Button` and `Input` primitives and `lucide-react`
 * icons. Accessible: labeled fields, `aria-live` error region, focus ring.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginSchema } from "../schemas/auth-schema";
import { useAuth } from "../hooks/use-auth";
import type { LoginCredentials } from "../types/auth.types";

interface LoginFormProps {
  /** Where to send the user after a successful sign-in. */
  callbackUrl?: string;
  className?: string;
}

export function LoginForm({ callbackUrl = "/dashboard", className }: LoginFormProps) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "", form: "" }));
    setServerError(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const parsed = loginSchema.safeParse({ ...form, callbackUrl });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as string] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const credentials: LoginCredentials = parsed.data;
      await signIn(credentials);
      // Hard navigation lets Next.js re-fetch server data for the new route.
      window.location.href = callbackUrl;
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-5", className)}
      noValidate
      aria-describedby={serverError ? "login-error" : undefined}
    >
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="pl-9"
            required
          />
        </div>
        {errors.email ? (
          <p id="login-email-error" className="text-xs text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className="pl-9"
            required
          />
        </div>
        {errors.password ? (
          <p id="login-password-error" className="text-xs text-destructive">
            {errors.password}
          </p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={(e) => update("remember", e.target.checked)}
          className="size-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
        />
        Keep me signed in for 30 days
      </label>

      {serverError ? (
        <div
          id="login-error"
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
            <Loader2 className="size-4 animate-spin" aria-hidden /> Signing in…
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" aria-hidden /> Sign in
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to ThunderFlow?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

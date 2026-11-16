"use client";

/**
 * RegisterForm — create a ThunderFlow account and a new workspace.
 * Validates password strength on the client via `registerSchema`.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, User, Building2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { registerSchema } from "../schemas/auth-schema";
import { useAuth } from "../hooks/use-auth";

interface RegisterFormProps {
  invitationToken?: string;
  className?: string;
}

const STRENGTH_RULES: Array<{ label: string; test: (v: string) => boolean }> = [
  { label: "12+ characters", test: (v) => v.length >= 12 },
  { label: "Lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Number", test: (v) => /[0-9]/.test(v) },
  { label: "Symbol", test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

export function RegisterForm({ invitationToken, className }: RegisterFormProps) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    tenantName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "", form: "" }));
    setServerError(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      tenantName: invitationToken ? undefined : form.tenantName,
      invitationToken,
    };

    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!next[key]) next[key] = issue.message;
      }
      if (form.password !== form.confirmPassword) {
        next.confirmPassword = "Passwords do not match";
      }
      setErrors(next);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setSubmitting(true);
    try {
      await signUp(parsed.data);
      window.location.href = "/onboarding";
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not create the account. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const passedRules = STRENGTH_RULES.filter((r) => r.test(form.password)).length;

  return (
    <form onSubmit={onSubmit} className={cn("space-y-5", className)} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="register-name" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <div className="relative">
          <User
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Jordan Rivera"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="pl-9"
            required
          />
        </div>
        {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-email" className="text-sm font-medium text-foreground">
          Work email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="pl-9"
            required
          />
        </div>
        {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
      </div>

      {!invitationToken ? (
        <div className="space-y-1.5">
          <label htmlFor="register-tenant" className="text-sm font-medium text-foreground">
            Workspace name
          </label>
          <div className="relative">
            <Building2
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="register-tenant"
              type="text"
              placeholder="Acme Operations"
              value={form.tenantName}
              onChange={(e) => update("tenantName", e.target.value)}
              aria-invalid={Boolean(errors.tenantName)}
              className="pl-9"
              required
            />
          </div>
          {errors.tenantName ? (
            <p className="text-xs text-destructive">{errors.tenantName}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="register-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-strength"
            className="pl-9"
            required
          />
        </div>
        {form.password ? (
          <ul
            id="password-strength"
            className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-xs"
            aria-label="Password requirements"
          >
            {STRENGTH_RULES.map((rule) => {
              const ok = rule.test(form.password);
              return (
                <li
                  key={rule.label}
                  className={cn(
                    "flex items-center gap-1.5",
                    ok ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <Check
                    className={cn("size-3", ok ? "opacity-100" : "opacity-30")}
                    aria-hidden
                  />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        ) : null}
        {errors.password ? <p className="text-xs text-destructive">{errors.password}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="register-confirm"
          className="text-sm font-medium text-foreground"
        >
          Confirm password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
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

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Password strength"
        aria-valuenow={passedRules}
        aria-valuemin={0}
        aria-valuemax={STRENGTH_RULES.length}
      >
        <div
          className={cn(
            "h-full transition-all duration-300",
            passedRules < 2
              ? "bg-destructive"
              : passedRules < 4
                ? "bg-warning"
                : "bg-success",
          )}
          style={{ width: `${(passedRules / STRENGTH_RULES.length) * 100}%` }}
        />
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
            <Loader2 className="size-4 animate-spin" aria-hidden /> Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

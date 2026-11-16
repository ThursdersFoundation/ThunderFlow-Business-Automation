"use client";

/**
 * ForgotPasswordForm — request a password reset link by email.
 * On success shows a confirmation state; the form is hidden afterwards.
 * The endpoint always returns 200 even for unknown emails to avoid
 * account enumeration.
 */
import { useState } from "react";
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "../schemas/auth-schema";
import { authService } from "../services/auth-service";

interface ForgotPasswordFormProps {
  className?: string;
  onSubmitted?: (email: string) => void;
}

export function ForgotPasswordForm({ className, onSubmitted }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      await authService.forgotPassword(parsed.data);
      setDone(true);
      onSubmitted?.(parsed.data.email);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className={cn("space-y-3 rounded-md border border-success/30 bg-success/5 p-6", className)}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden />
        <h2 className="text-center text-lg font-semibold">Check your inbox</h2>
        <p className="text-center text-sm text-muted-foreground">
          If an account exists for{" "}
          <span className="font-medium text-foreground">{email}</span>, you will receive a
          password reset link within a few minutes. The link expires in 30 minutes.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Didn&apos;t get the email? Check your spam folder, then{" "}
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setEmail("");
            }}
            className="text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-5", className)} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            className="pl-9"
            required
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      ) : null}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}

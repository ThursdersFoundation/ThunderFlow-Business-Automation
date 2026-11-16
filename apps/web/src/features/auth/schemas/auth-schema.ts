/**
 * Auth feature — Zod schemas
 * Validates input on the client before sending it to the API.
 * Server-side schemas are the source of truth; these mirror them.
 */
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^a-zA-Z0-9]/, "Include at least one symbol");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
  callbackUrl: z.string().url().optional(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    password: passwordSchema,
    tenantName: z
      .string()
      .min(3, "Workspace name must be at least 3 characters")
      .max(40, "Workspace name is too long")
      .optional(),
    invitationToken: z.string().min(1).optional(),
  })
  .refine((data) => !!data.tenantName || !!data.invitationToken, {
    message: "Provide a workspace name or an invitation token.",
    path: ["tenantName"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const twoFactorVerifySchema = z.object({
  challengeId: z.string().min(1, "Missing challenge"),
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
  trustDevice: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type TwoFactorVerifyInput = z.infer<typeof twoFactorVerifySchema>;

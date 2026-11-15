import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — merge Tailwind class names safely.
 *
 * Combines `clsx` (conditional + object syntax) with `tailwind-merge` so that
 * conflicting utilities resolve to the last one declared (e.g.
 * `cn("px-2", condition && "px-4")` -> `px-4`), which is what every
 * ThunderFlow component expects.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a byte count into a human-readable string (1024-based). */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k)),
  );
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

/** Initials from a display name, e.g. "Ada Lovelace" -> "AL". */
export function initialsFromName(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic HSL color from an arbitrary seed string (avatar fallbacks). */
export function colorFromString(input: string): { h: number; s: number; l: number } {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // keep it a 32-bit int
  }
  const h = Math.abs(hash) % 360;
  // Keep saturation/lightness in a friendly pastel band.
  return { h, s: 65, l: 55 };
}

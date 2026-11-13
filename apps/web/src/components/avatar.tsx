"use client";

import * as React from "react";
import Image from "next/image";
import { cn, initialsFromName, colorFromString } from "@/lib/utils";

/**
 * Avatar — user / entity thumbnail with graceful fallback.
 *
 * Render order:
 *  1. `src` image (via next/image) when provided.
 *  2. Initials derived from `name`, on a deterministic pastel background.
 *  3. A single "?" mark.
 *
 * Sizes map to the same scale used across ThunderFlow so avatars stay
 * aligned in lists, headers and comments.
 */
const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

type AvatarSize = keyof typeof SIZES;

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: AvatarSize;
  /** Show a small presence / status dot in the bottom-right corner. */
  status?: "online" | "away" | "busy" | "offline";
}

const STATUS_COLOR: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-destructive",
  offline: "bg-muted-foreground",
};

function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  className,
  ...props
}: AvatarProps) {
  const initials = initialsFromName(name);
  const fallbackStyle =
    name != null
      ? (() => {
          const { h, s, l } = colorFromString(name);
          return {
            backgroundColor: `hsl(${h} ${s}% ${l}% / 0.9)`,
            color: "white",
          } as React.CSSProperties;
        })()
      : undefined;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-medium",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? name ?? "Avatar"}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-full w-full items-center justify-center"
          style={fallbackStyle}
        >
          {initials}
        </span>
      )}

      {status ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
            STATUS_COLOR[status],
          )}
          aria-label={`Status: ${status}`}
        />
      ) : null}

      <span className="sr-only">{alt ?? name ?? "Avatar"}</span>
    </span>
  );
}

export { Avatar };

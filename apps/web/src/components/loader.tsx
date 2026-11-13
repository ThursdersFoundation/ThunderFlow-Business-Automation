import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Loader — loading indicators for ThunderFlow.
 *
 * Three modes:
 *  - `spinner` (default): an inline spinning icon, sized via `size`.
 *  - `dots`: three pulsing dots, good for inline chat/bot feedback.
 *  - `skeleton`: a shimmering placeholder block (uses .tf-skeleton).
 *
 * `Loader` is layout-safe: spinner and dots are inline-flex and never
 * collapse the page height while a route resolves.
 */
const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

type LoaderSize = keyof typeof SIZES;

interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the indicator. */
  variant?: "spinner" | "dots" | "skeleton";
  /** Icon size for `spinner`; width/height of the block for `skeleton`. */
  size?: LoaderSize;
  /** Accessible label announced to screen readers. */
  label?: string;
}

const Loader = React.forwardRef<HTMLSpanElement, LoaderProps>(
  (
    {
      className,
      variant = "spinner",
      size = "md",
      label = "Loading",
      ...props
    },
    ref,
  ) => {
    if (variant === "skeleton") {
      return (
        <span
          ref={ref}
          role="status"
          aria-live="polite"
          aria-label={label}
          className={cn("tf-skeleton block rounded-md", SIZES[size], className)}
          {...props}
        />
      );
    }

    if (variant === "dots") {
      return (
        <span
          ref={ref}
          role="status"
          aria-live="polite"
          aria-label={label}
          className={cn("inline-flex items-center gap-1", className)}
          {...props}
        >
          <span className="sr-only">{label}</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-current"
              style={{
                animation: "tf-pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn("inline-flex items-center text-muted-foreground", className)}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <Loader2 className={cn("animate-spin", SIZES[size])} aria-hidden />
      </span>
    );
  },
);
Loader.displayName = "Loader";

export { Loader };

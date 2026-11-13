"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SearchBar — controlled search input with icon, clear button, and
 * optional debounced callback.
 *
 * Accessibility:
 *  - Always renders a visible label (or `aria-label` when `label` is hidden).
 *  - Announces the loading state via `aria-live`.
 *  - Clear button is keyboard-focusable and labeled.
 *
 * The `onDebouncedChange` callback fires `delay` ms after the last keystroke,
 * so parent components don't need their own debounce plumbing.
 */
interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Visible label above the field. Hidden visually when `hideLabel` is set. */
  label?: string;
  hideLabel?: boolean;
  /** Placeholder shown when empty. */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Fires on every keystroke (raw, undebounced). */
  onValueChange?: (value: string) => void;
  /** Fires after the user stops typing for `delay` ms. */
  onDebouncedChange?: (value: string) => void;
  /** Debounce window in ms (default 300). */
  delay?: number;
  /** Show a spinner on the right while a search is in flight. */
  loading?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      label = "Search",
      hideLabel = true,
      placeholder = "Search…",
      value,
      onValueChange,
      onDebouncedChange,
      delay = 300,
      loading = false,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const statusId = `${inputId}-status`;

    const [internal, setInternal] = React.useState(value ?? "");
    const current = value ?? internal;

    React.useEffect(() => {
      if (onDebouncedChange == null) return;
      const handle = setTimeout(() => onDebouncedChange(current), delay);
      return () => clearTimeout(handle);
    }, [current, delay, onDebouncedChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInternal(next);
      onValueChange?.(next);
    };

    const handleClear = () => {
      setInternal("");
      onValueChange?.("");
      onDebouncedChange?.("");
    };

    return (
      <div className={cn("w-full", className)}>
        <label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium text-foreground",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </label>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            ref={ref}
            id={inputId}
            type="search"
            role="searchbox"
            value={current}
            placeholder={placeholder}
            onChange={handleChange}
            aria-describedby={loading ? statusId : undefined}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm shadow-sm transition-colors",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            {...props}
          />

          {loading ? (
            <>
              <span id={statusId} className="sr-only" aria-live="polite">
                Searching…
              </span>
              <Loader2
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden
              />
            </>
          ) : current.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);
SearchBar.displayName = "SearchBar";

export { SearchBar };

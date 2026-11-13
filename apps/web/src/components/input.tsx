import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input — styled text field for ThunderFlow forms.
 *
 * Forwards refs, supports `aria-invalid` for error states, and keeps the
 * same focus ring token as the rest of the design system.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={ariaInvalid}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          ariaInvalid && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

/**
 * ThemeProvider — light/dark/system theme context for ThunderFlow.
 *
 * A self-contained replacement for next-themes (no external dependency):
 *  - Persists the chosen theme to localStorage under `storageKey`.
 *  - Respects `prefers-color-scheme` when theme === "system".
 *  - Applies the resolved theme as a `class` on <html> (matches the
 *    `.dark` selector in globals.css).
 *  - Avoids a flash of the wrong theme by injecting an inline script before
 *    hydration (see `ThemeScript` below — render it in <head> via the root
 *    layout, or it is auto-rendered into the document via this provider).
 *
 * The `useTheme()` hook exposes the chosen theme, the resolved theme
 * (always "light" or "dark"), and a setter.
 */

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface ThemeContextValue {
  /** The user's chosen theme (may be "system"). */
  theme: Theme;
  /** The theme actually applied after resolving "system". */
  resolvedTheme: Resolved;
  /** Whether the provider has mounted and read the real value. */
  ready: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_DEFAULT = "thunderflow-theme";
const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function applyThemeClass(resolved: Resolved) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

function resolveSystem(): Resolved {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  /** Apply the class to a different attribute (default "class"). */
  attribute?: "class" | "data-theme";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY_DEFAULT,
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<Resolved>("light");
  const [ready, setReady] = React.useState(false);

  // Read persisted theme on mount.
  React.useEffect(() => {
    let stored: Theme | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === "light" || raw === "dark" || raw === "system") {
        stored = raw;
      }
    } catch {
      // localStorage may be blocked (private mode, SSR mismatch); ignore.
    }
    const initial = stored ?? defaultTheme;
    setThemeState(initial);

    const resolve = () =>
      initial === "system" ? resolveSystem() : (initial as Resolved);

    const apply = () => {
      const resolved = resolve();
      setResolvedTheme(resolved);
      if (attribute === "class") {
        applyThemeClass(resolved);
      } else {
        document.documentElement.setAttribute("data-theme", resolved);
      }
    };

    apply();
    setReady(true);

    if (initial === "system") {
      const mql = window.matchMedia(THEME_MEDIA_QUERY);
      const listener = () => apply();
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    }
    return undefined;
  }, [defaultTheme, storageKey, attribute]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore persistence failures
      }
      const resolved: Resolved =
        next === "system" ? resolveSystem() : (next as Resolved);
      setResolvedTheme(resolved);
      if (attribute === "class") {
        applyThemeClass(resolved);
      } else {
        document.documentElement.setAttribute("data-theme", resolved);
      }
    },
    [storageKey, attribute],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, ready, setTheme, toggleTheme }),
    [theme, resolvedTheme, ready, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (ctx == null) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return ctx;
}

/**
 * ThemeScript — injects an inline, blocking script that sets the theme
 * class on <html> before React hydrates, preventing a flash of the wrong
 * theme. Render this once inside <head> from the root layout.
 */
export function ThemeScript({
  storageKey = STORAGE_KEY_DEFAULT,
  defaultTheme = "system",
}: {
  storageKey?: string;
  defaultTheme?: Theme;
}) {
  const code = `(function(){try{var k=${JSON.stringify(
    storageKey,
  )};var d=${JSON.stringify(defaultTheme)};var t=localStorage.getItem(k)||d;var m=window.matchMedia("(prefers-color-scheme: dark)");var r=t==="system"?(m.matches?"dark":"light"):t;var e=document.documentElement;if(${JSON.stringify(
    "class",
  )}){e.classList.toggle("dark",r==="dark");e.style.colorScheme=r;}else{e.setAttribute("data-theme",r);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

/** ThemeToggle — small button that cycles light / dark / system. */
export function ThemeToggle() {
  const { theme, setTheme, ready } = useTheme();
  const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const label =
    theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      disabled={!ready}
      aria-label={`Theme: ${label}. Click to switch.`}
      title={`Theme: ${label}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : theme === "dark" ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Monitor className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

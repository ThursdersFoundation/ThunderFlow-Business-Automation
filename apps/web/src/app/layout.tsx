import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { SessionProvider } from "@/components/providers/session-provider";
import { ErrorBoundary } from "@/components/providers/error-boundary";
import { cn } from "@/lib/utils";

/**
 * ThunderFlow — Business Automation Platform
 * Root layout for the Next.js App Router.
 *
 * Responsibilities:
 *  - Establishes the HTML document shell and global font + CSS variables.
 *  - Mounts client-side providers (theme, session, command palette, toasts).
 *  - Renders the authenticated application shell (sidebar + topbar + main).
 *  - Exposes SEO metadata, OpenGraph and viewport defaults for the whole app.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.thunderflow.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ThunderFlow — Business Automation Platform",
    template: "%s · ThunderFlow",
  },
  description:
    "ThunderFlow automates the workflows that run your business — approvals, " +
    "document routing, integrations and notifications — on one visual, " +
    "low-code platform built for operations and finance teams.",
  applicationName: "ThunderFlow",
  generator: "Next.js",
  keywords: [
    "business automation",
    "workflow automation",
    "BPA",
    "low-code workflow",
    "document routing",
    "approvals automation",
    "RPA alternative",
    "process orchestration",
    "ThunderFlow",
  ],
  authors: [{ name: "ThunderFlow, Inc.", url: siteUrl }],
  creator: "ThunderFlow, Inc.",
  publisher: "ThunderFlow, Inc.",
  category: "Business Software",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ThunderFlow",
    title: "ThunderFlow — Business Automation Platform",
    description:
      "Visual, low-code automation for approvals, document routing, " +
      "integrations and notifications across your operations.",
    images: [
      {
        url: "/og/thunderflow-default.png",
        width: 1200,
        height: 630,
        alt: "ThunderFlow — Business Automation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThunderFlow — Business Automation Platform",
    description:
      "Visual, low-code automation for approvals, document routing, " +
      "integrations and notifications across your operations.",
    images: ["/og/thunderflow-default.png"],
    creator: "@thunderflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          jakarta.variable,
          "min-h-screen bg-background font-sans text-foreground antialiased",
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              {/* Skip link for keyboard & screen-reader users */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to main content
              </a>

              <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex flex-1 flex-col">
                  <Topbar />

                  <main
                    id="main-content"
                    className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
                  >
                    {children}
                  </main>

                  <footer className="border-t px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
                      <p>
                        © {new Date().getFullYear()} ThunderFlow, Inc. All
                        rights reserved.
                      </p>
                      <nav
                        aria-label="Footer"
                        className="flex items-center gap-4"
                      >
                        <a
                          href="/legal/privacy"
                          className="hover:text-foreground"
                        >
                          Privacy
                        </a>
                        <a
                          href="/legal/terms"
                          className="hover:text-foreground"
                        >
                          Terms
                        </a>
                        <a
                          href="/status"
                          className="hover:text-foreground"
                        >
                          Status
                        </a>
                      </nav>
                    </div>
                  </footer>
                </div>
              </div>

              <CommandPalette />
              <Toaster richColors closeButton position="top-right" />
            </ErrorBoundary>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

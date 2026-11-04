import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ThunderFlow — Business Automation",
    template: "%s · ThunderFlow",
  },
  description:
    "Build, run, and monitor automated business workflows with approvals, " +
    "integrations, and real-time analytics.",
  applicationName: "ThunderFlow",
  authors: [{ name: "Thunders Robotic" }],
  keywords: [
    "workflow", "automation", "business process", "integrations",
    "approvals", "no-code", "low-code",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ThunderFlow — Business Automation",
    description: "Automate business workflows with approvals, integrations, and analytics.",
    type: "website",
    siteName: "ThunderFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThunderFlow — Business Automation",
    description: "Automate business workflows with approvals, integrations, and analytics.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}

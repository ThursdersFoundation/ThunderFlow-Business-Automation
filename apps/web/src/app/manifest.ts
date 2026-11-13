import type { MetadataRoute } from "next";

/**
 * ThunderFlow — PWA web app manifest.
 *
 * Served at /manifest.webmanifest by Next.js. Icons resolve from /public;
 * create the referenced PNG/SVG assets there.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.thunderflow.io";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ThunderFlow — Business Automation Platform",
    short_name: "ThunderFlow",
    description:
      "Visual, low-code automation for approvals, document routing, " +
      "integrations and notifications across your operations.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0b1020",
    theme_color: "#6d28d9",
    categories: ["business", "productivity", "developer", "utilities"],
    lang: "en-US",
    dir: "ltr",
    id: "/",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "My workflows",
        short_name: "Workflows",
        description: "Open the workflow list",
        url: "/workflows?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-workflows.png", sizes: "96x96" }],
      },
      {
        name: "New workflow",
        short_name: "New",
        description: "Open the visual workflow builder",
        url: "/workflows/new?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-new.png", sizes: "96x96" }],
      },
      {
        name: "Activity",
        short_name: "Activity",
        description: "View recent run activity",
        url: "/activity?source=pwa-shortcut",
        icons: [{ src: "/icons/shortcut-activity.png", sizes: "96x96" }],
      },
    ],
    screenshots: [
      {
        src: "/screenshots/dashboard-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "ThunderFlow dashboard on desktop",
      },
      {
        src: "/screenshots/builder-narrow.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Workflow builder on mobile",
      },
    ],
    related_applications: [
      {
        platform: "webapp",
        url: `${appUrl}/manifest.webmanifest`,
      },
    ],
    prefer_related_applications: false,
  };
}

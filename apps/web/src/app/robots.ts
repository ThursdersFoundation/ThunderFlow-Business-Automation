import type { MetadataRoute } from "next";

/**
 * ThunderFlow — robots.txt generator.
 *
 * Served at /robots.txt by Next.js. The public marketing/docs surfaces are
 * indexed; the authenticated app surface is disallowed and points at the
 * sitemap.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.thunderflow.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/blog", "/pricing", "/customers", "/legal"],
        disallow: [
          "/app",
          "/app/*",
          "/workflows",
          "/workflows/*",
          "/activity",
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
        ],
      },
      // Keep indexing bots off account / billing / settings surface areas.
      {
        userAgent: "GPTBot",
        disallow: ["/docs/internal/*", "/customers/private/*"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/docs/internal/*"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  };
}

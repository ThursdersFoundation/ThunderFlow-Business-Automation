# `public/`

Static, publicly-served assets for the ThunderFlow web app. Files in this
directory are served at the site root by Next.js (e.g. `public/robots.txt`
becomes `https://app.thunderflow.io/robots.txt`).

## What's here

| Path            | Contents                                                    |
| --------------- | ----------------------------------------------------------- |
| `images/`       | Branding, backgrounds, illustrations, avatars, integration & workflow icons, dashboard previews. |
| `icons/`        | UI icon set (Lucide-style SVGs).                            |
| `fonts/`        | Self-hosted web fonts (Inter, Roboto, custom icon font).    |
| `favicon.*`     | Multi-format favicon (ICO + SVG + PNG sizes).               |
| `logo.*`        | Root-level logo files mirrored from `images/branding/`.     |
| `robots.txt`    | Crawler directives.                                         |
| `sitemap.xml`   | Static sitemap (Next.js app-router apps usually generate this dynamically — see `apps/web/src/app/sitemap.ts`). |
| `site.webmanifest` | PWA manifest for installable web app.                    |

## Caching & cache-busting

Next.js sets long-lived `Cache-Control` headers for files in `public/`. To
force clients to re-fetch an updated asset, **rename the file** (e.g.
`logo-v2.png`) or use a build-time asset-hash pipeline. Do not rely on
query-string cache-busting — some CDNs ignore it.

## Regenerating brand assets

```bash
python3 scripts/gen_public_svgs.py       # SVG icons, illustrations, logos
python3 scripts/gen_public_binaries.py   # PNG / JPG / ICO / font placeholders
```

## License

Brand assets (logos, favicons, illustrations) are © Thunders Robotic — all
rights reserved. Open-source icon sets (Lucide) retain their ISC license.
Fonts retain their original licenses (see `fonts/README.md`).

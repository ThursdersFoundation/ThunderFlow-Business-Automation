# `images/`

Static image assets served from `apps/web/public/images/`. Sub-folders group
assets by purpose so designers can drop in updates without touching code.

## Layout

| Folder           | Contents                                                      |
| ---------------- | ------------------------------------------------------------- |
| `branding/`      | Logo variants (full-color, dark, light, horizontal, vertical, symbol-only). |
| `backgrounds/`   | Large photographic/gradient backgrounds for login, hero, dashboard, workflow canvases. |
| `illustrations/` | SVG empty-state and error-page illustrations (404, 500, maintenance). |
| `avatars/`       | Default user/team avatar images (PNG + SVG fallbacks).       |
| `integrations/`  | Square icons for third-party integrations (Slack, Google, Discord, ...). |
| `workflow/`      | Workflow node icons used in the visual builder canvas.       |
| `dashboard/`     | Preview/mock-up images for marketing pages and docs.         |

## Conventions

- **Raster**: PNG (transparent or opaque), JPG only for large photographic
  backgrounds. Keep PNGs ≤ 200 KB; use TinyPNG / oxipng before committing.
- **Vector**: SVG only. Inline `<svg>` in components when used once; place in
  `images/` only when reused across pages or referenced from CSS.
- **Naming**: kebab-case, descriptive (`logo-dark.png`, `empty-workflows.svg`).
- **Brand colors**: indigo `#4F46E5` (primary), amber `#F59E0B` (accent),
  slate `#0F172A` (text). See `apps/web/src/app/globals.css` for the full
  design-token reference.

## Regenerating brand assets

The logos, favicons, dashboard mockups, and integration icons are generated
from `/home/z/my-project/scripts/gen_public_svgs.py` and
`gen_public_binaries.py`. Re-run those scripts after editing the brand palette.

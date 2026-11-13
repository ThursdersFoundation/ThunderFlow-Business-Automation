# Contributing to ThunderFlow

First off — thank you for taking the time to contribute. ThunderFlow exists to give operations and finance teams a faster way to model the workflows that run their business, and every bug report, design idea, docs fix and pull request makes the platform better for everyone.

This document explains how to set up the project locally, what we expect from a contribution, and how to get your work merged.

## Table of contents

1. [Code of Conduct](#code-of-conduct)
2. [Project roadmap & scope](#project-roadmap--scope)
3. [Tech stack at a glance](#tech-stack-at-a-glance)
4. [Development setup](#development-setup)
5. [Project structure](#project-structure)
6. [Coding standards](#coding-standards)
7. [Commit message conventions](#commit-message-conventions)
8. [Pull request workflow](#pull-request-workflow)
9. [Testing](#testing)
10. [Accessibility & performance](#accessibility--performance)
11. [Working with the design system](#working-with-the-design-system)
12. [Internationalization](#internationalization)
13. [Adding a new integration](#adding-a-new-integration)
14. [Recognition](#recognition)
15. [Questions](#questions)

---

## Code of Conduct

By participating you agree to uphold the [ThunderFlow Code of Conduct](./CODE_OF_CONDUCT.md). Be kind, be specific, assume good intent, and report any unacceptable behaviour to `conduct@thunderflow.io` rather than hashing it out in a public issue.

## Project roadmap & scope

ThunderFlow focuses on the **business-automation** surface: a visual workflow canvas, a typed action library, governance (audit log, approvals, SSO), and the integrations that operations teams actually need (Slack, HubSpot, Notion, Stripe, custom webhooks). If your change broadens scope into unrelated territory (general-purpose note-taking, a marketing CMS, etc.), open a discussion issue first so we can decide whether it belongs in core or as a plugin.

The current roadmap lives under the [`roadmap`](https://github.com/thunderflow/thunderflow/labels/roadmap) label on GitHub. Anything tagged `good first issue` is a great starting point.

## Tech stack at a glance

| Layer        | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | Next.js 14+ (App Router, RSC, Server Actions)      |
| Language     | TypeScript (strict)                                |
| Styling      | Tailwind CSS v4 (`@theme inline` design tokens)     |
| UI primitives| shadcn/ui patterns, `lucide-react` icons            |
| Database     | PostgreSQL 16 + Prisma ORM                          |
| Queue/cache  | Redis 7 + BullMQ                                    |
| Auth         | NextAuth.js v4 / Auth.js                            |
| Object store | S3-compatible (AWS, Cloudflare R2, MinIO locally)   |
| Testing      | Vitest + Playwright                                 |
| Observability| Sentry (errors), PostHog (product), OpenTelemetry  |

## Development setup

You need Node.js 20+, pnpm 9+, Docker, and git. On macOS and Linux the steps below should work as-is; on Windows use WSL2.

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/thunderflow.git
cd thunderflow

# 2. Add the upstream remote
git remote add upstream https://github.com/thunderflow/thunderflow.git

# 3. Install dependencies
pnpm install

# 4. Start the backing services (Postgres, Redis, MinIO, Mailpit)
docker compose up -d

# 5. Create your local env file from the template
cp .env.example .env.local
#   → fill in any secrets you actually want to use

# 6. Apply migrations and seed the dev dataset
pnpm prisma migrate dev
pnpm db:seed

# 7. Run the dev server
pnpm dev
#   → http://localhost:3000
```

If you change Prisma schema, run `pnpm prisma:generate` so the TypeScript types update.

## Project structure

```
app/                     # App Router routes (page.tsx, layout.tsx, loading.tsx, ...)
components/
  ui/                    # Buttons, Inputs, Cards, Modal, etc. (shadcn-style)
  layout/                # Sidebar, Topbar, Footer, Navbar, CommandPalette
  providers/             # ThemeProvider, SessionProvider, ErrorBoundary
lib/                     # Pure utilities — cn(), auth, prisma client, etc.
prisma/
  schema.prisma
  migrations/
scripts/                 # One-off scripts (favicon gen, seed, etc.)
public/                  # Static assets
tests/                   # Vitest unit tests + Playwright e2e
```

Anything under `components/ui/` follows the shadcn convention: copied in, owned by us, free to edit. Do not import from `@radix-ui/*` directly in app code — wrap the primitive in a `components/ui/*` module first so we keep a single seam.

## Coding standards

- **TypeScript everywhere, strict mode.** No `any` without a code comment explaining why. Prefer `unknown` + narrowing.
- **Server Components by default.** Only add `"use client"` when you genuinely need browser APIs, hooks, or interactivity. Keep client components small and pushed to the leaves of the tree.
- **No silent failures.** Functions that can fail return a typed `Result` or throw a documented error class. `try/catch` must either re-throw, log to Sentry, or surface a user-actionable message.
- **Naming.** PascalCase for components and types, camelCase for functions and variables, UPPER_SNAKE for env vars and constants, kebab-case for filenames except React component files which are PascalCase.
- **Imports.** Use the `@/` path alias. Group: external → internal `@/lib` → `@/components` → relative. Sort with the bundled ESLint rule.
- **No magic strings.** Repeated literals (status codes, role names, event names) live in `lib/constants.ts`.
- **Comments.** Explain why, not what. Doc comments (`/** ... */`) on exported functions.

Lint and format before pushing:

```bash
pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm format        # prettier --write
```

## Commit message conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) so the changelog can be generated automatically.

```
<type>(<scope>): <short description in imperative mood>

[optional body explaining why, not what]

[optional footer: BREAKING CHANGE: ..., Closes #123]
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`.

Scope examples: `workflow-engine`, `ui`, `auth`, `prisma`, `docs`.

Examples:

```
feat(workflow-engine): support parallel branches in canvas
fix(auth): redirect to original URL after OAuth callback
docs(readme): clarify self-hosting env vars
```

## Pull request workflow

1. Open an issue first for anything bigger than a typo fix — it saves wasted work.
2. Branch from `main`: `git checkout -b feat/short-description`.
3. Make small, focused commits. One logical change per commit.
4. Run `pnpm lint && pnpm typecheck && pnpm test` locally.
5. Push and open a PR against `main`. Fill in the PR template:
   - **What** — one paragraph summary.
   - **Why** — the issue or motivation this addresses.
   - **How** — the high-level approach, and any alternatives you considered.
   - **Testing** — which tests you added or ran, and how a reviewer can reproduce.
   - **Screenshots / recordings** — required for any visual change.
   - **Breaking changes** — explicit callout if any.
6. Request review from a maintainer. Address review comments with new commits, not force-pushes that erase history mid-review (unless the reviewer asks for a squash).
7. Once approved and CI is green, a maintainer will squash-merge.

We aim for first review within 3 business days. If a PR goes quiet, ping it once — we may have missed the notification.

## Testing

- **Unit tests** with Vitest live next to the source file as `*.test.ts` / `*.test.tsx`. Cover pure logic, hooks, and component rendering for non-trivial UI.
- **E2E tests** with Playwright live under `tests/e2e/`. Cover the critical user journeys: sign in, create workflow, run it, view audit log.
- **Snapshot tests** are reserved for stable visual primitives (`Button`, `Badge`, `Card`). Prefer explicit assertions for everything else.
- Targeted coverage goals (not gates): `lib/` ≥ 90%, `app/api/` ≥ 80%, `components/` ≥ 60%.

Run the suite:

```bash
pnpm test           # vitest watch
pnpm test:ci        # vitest run, single pass
pnpm test:e2e       # playwright
```

## Accessibility & performance

Every UI contribution must:

- Be keyboard navigable. Tab order must follow visual order; focus rings must be visible.
- Have appropriate ARIA only when semantics are not expressible in native HTML. A `role` is not a substitute for the right element.
- Meet WCAG 2.1 AA contrast in both light and dark themes (tokens already satisfy this — do not hard-code colors).
- Not introduce layout shift above 0.1 CLS on the homepage or dashboard.

Run `pnpm a11y` (axe) and `pnpm lighthouse` before opening a PR that touches UI.

## Working with the design system

Design tokens live in `app/globals.css` under `:root` and `.dark`, exposed to Tailwind through `@theme inline`. Use these tokens — never raw hex values. The brand violet is `--primary` (`HSL(252 83% 58%)`). If you need a color that does not exist, propose it in the PR rather than inlining it.

Component variants are declared with `cva` from `class-variance-authority`. New variants go in the component's `*.tsx` file, not in a separate theme file.

## Internationalization

The UI is English-first today. Any user-facing string you add should be wrapped with the project's `t()` helper so we can extract it later — even if you only add the English key. Do not concatenate translated fragments; use templates with placeholders.

## Adding a new integration

1. Create `lib/integrations/<name>/` with `client.ts` (typed wrapper), `schema.ts` (Zod for inbound/outbound payloads), and `actions.ts` (action descriptors used by the canvas).
2. Register the OAuth client in `lib/auth/providers.ts` if it needs user authorization.
3. Add a row to the integrations table in the seed script and to the in-app catalog.
4. Add an e2e test that exercises at least the connection flow with a fixture.

## Recognition

Contributors who land three merged PRs are invited to the `contributors` team and get a shout-out in the release notes. Maintainers are added by nomination from existing maintainers.

## Questions

- **"Is this a bug or a feature?"** → open a `discussion` first.
- **"Where does X belong?"** → check `ARCHITECTURE.md` (if present) or ask in `#thunderflow-dev` on our community Slack.
- **Security-sensitive?** → see [SECURITY.md](./SECURITY.md). Do **not** open a public issue.

Thanks again for helping build ThunderFlow. ⚡

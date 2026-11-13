# Security Policy

ThunderFlow takes the security of the platform and the data our customers
trust us with seriously. This document describes how to report
vulnerabilities, what we support, and what to expect when you share a finding
with us.

## Supported versions

ThunderFlow is in active development. We maintain security fixes for the two
most recent minor releases of the `main` line:

| Version | Supported          | Notes                                  |
| ------- | ------------------ | -------------------------------------- |
| 1.x     | ✅ Active           | Current release line                   |
| 0.x     | ⚠️ Critical only    | Only critical fixes; upgrade to 1.x   |
| < 0.x   | ❌ Unsupported       | No backports; migrate to a supported line |

Self-hosted deployments should run a tagged release, not `main`. Cloud users
are always on the latest release.

## Reporting a vulnerability

**Please report security issues privately — do not open a public GitHub
issue.**

Email: `security@thunderflow.io`

Include as much of the following as you can:

- A description of the issue and the impact you believe it has.
- The affected version or commit SHA (run `git rev-parse HEAD` for self-hosted).
- Step-by-step reproduction, including any non-sensitive request payloads.
- A minimal proof of concept (script, screenshot, or HTTP transcript).
- Suggested mitigation or fix, if you have one.
- Whether you intend to publish the finding, and on what timeline.

You will receive an acknowledgement within **3 business days**. We will keep
you updated as we triage and patch, and credit you in the advisory once a fix
is released — unless you ask to remain anonymous.

If you are a customer, you can also report through the in-app
**Help → Report a security issue** form, which routes to the same inbox.

## Scope and out-of-scope

### In scope

- The `thunderflow` source repository, including:
  - The Next.js application and its API routes.
  - The workflow engine and its sandboxed script runtime.
  - Integration clients (Slack, HubSpot, Notion, Stripe, etc.) shipped by
    ThunderFlow.
- The official Docker images we publish.
- Our hosted `app.thunderflow.io` and `thunderflow.io` properties, including
  any SSO flows on the app subdomain.

### Out of scope

- Vulnerabilities in third-party services we integrate with (Slack, Stripe,
  etc.). Report those to the upstream vendor.
- Self-hosted deployments running modified source or unsupported versions.
- Findings from automated scanners without a verified, exploitable path.
- Issues that require a compromised privileged account on a customer tenant
  (e.g. an admin who can already do X being able to also do Y).
- Social engineering of ThunderFlow staff or contractors.
- Physical attacks against data centers — report to the relevant cloud
  provider.
- DoS that does not demonstrate a new vector beyond "send a lot of traffic".
- Rate-limit bypasses that are intentional (e.g. unauthenticated public API
  has a generous limit by design) — please check `lib/constants.ts` first.

## Rewards

ThunderFlow runs a private bug bounty program. Eligible findings receive a
reward based on severity, calculated with CVSS 3.1 plus our own impact
adjustment for business risk. We do not pay a fixed bounty table; instead we
communicate a proposed reward during triage and confirm it before the fix
ships. The current reward bands:

| Severity  | Typical reward (USD) |
| --------- | -------------------- |
| Critical  | $2,000 – $10,000     |
| High      | $750 – $2,000         |
| Medium    | $250 – $750           |
| Low       | $100 – $250           |

We may exceed the high end for findings that expose customer data at scale
or that demonstrate a previously unknown class of attack. Swag and
contributor credit are always offered regardless of reward.

## Disclosure policy

We follow coordinated disclosure:

1. You report the issue privately.
2. We acknowledge within 3 business days and triage within 10 business days.
3. We work with you on a fix and an embargo period (typically 90 days from
   the initial report, or sooner by mutual agreement).
4. We publish a security advisory on GitHub (`GHSA`) and on
   `https://thunderflow.io/security` once a patched release is available.
5. You are credited unless you ask to remain anonymous.

We will not take legal action against good-faith research, even when a
finding falls out of scope, provided the research respects user privacy,
does not access or destroy other people's data, and avoids service
disruption. When in doubt, contact us before proceeding.

## Hardening notes for self-hosters

A few things that are commonly missed when self-hosting ThunderFlow:

- **Set `AUTH_SECRET`** to a fresh 32-byte random value. The app refuses to
  boot without it in production.
- **Reverse-proxy with TLS**. Terminate TLS at your load balancer and only
  expose ports 80/443. Do not expose Postgres (5432), Redis (6379), or MinIO
  (9000/9001) to the public internet.
- **Restrict `S3_PUBLIC_BASE_URL`** to read-only prefixes. Signed URLs are
  used for private artifacts; the public base is only for genuinely public
  assets.
- **Run migrations as part of deploy**, not ad hoc. `pnpm prisma migrate
  deploy` should be the first step of your release pipeline.
- **Enable PostHog / Sentry in production**. The app fails closed on missing
  telemetry keys, but you lose visibility into production incidents.

## Security contacts

| Purpose                    | Address                        |
| -------------------------- | ------------------------------ |
| Vulnerability reports      | `security@thunderflow.io`      |
| Conduct / harassment       | `conduct@thunderflow.io`       |
| General security questions | `security@thunderflow.io`      |

PGP key fingerprint for `security@thunderflow.io`:
`9F3A 4C2B 8E1D 7F60 5A9C  BB12 6D80 4E21 3A7C F50E`

The full key is available at `https://thunderflow.io/.well-known/pgp-key.asc`.

Thank you for helping keep ThunderFlow and our users safe.

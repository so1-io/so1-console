# so1-console

Org-wide control plane UI for the so1 platform. Provides dashboards for GitHub repositories, n8n workflows, MCP tool registry, and operational visibility.

## What It Is

`so1-console` is a Next.js 16 App Router application that serves as the primary interface for managing organization-wide resources and operations. It integrates with a same-origin BFF (`so1-control-plane-api`) to broker access to GitHub, n8n, and MCP services with consistent authentication, authorization, and audit logging.

Key surfaces:
- **Catalog**: GitHub org/repo inventory and health status
- **Workflows**: n8n workflow runs and history
- **Ops/Jobs**: Long-running job execution and streaming logs
- **MCP Registry**: Tool discovery and invocation

## What It Is Not

- **Not a backend service**: all business logic and API coordination lives in the BFF (`so1-control-plane-api`)
- **Not a monorepo**: single Next.js app (multi-workspace monorepo patterns deferred)
- **Not mobile-first**: optimized for desktop/tablet dashboards

## Repository Layout

- `src/app/` — Next.js 16 App Router routes (SSR layout, pages, auth gates)
- `src/components/` — React components (UI, features, error boundaries)
- `src/lib/` — utilities, API client, hooks, context
- `docs/` — architecture, runbooks, deployment guides
- `.github/workflows/` — CI/CD pipelines

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build
npm start
```

Environment variables (see `.env.example` after first run):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret (not exposed to browser)
- `NEXT_PUBLIC_BFF_URL` — so1-control-plane-api base URL

## Status

- Status: `draft`
- Versioning: semantic (major.minor.patch); tagged at releases

## Architecture Decision Records

See `_meta/adr/` at workspace root for design decisions:
- `001-auth.md` — Clerk OIDC, session handling
- `002-bff.md` — BFF rationale and adapter pattern
- `003-job-model.md` — Long-running job model
- `004-error-envelope.md` — Standard error shapes

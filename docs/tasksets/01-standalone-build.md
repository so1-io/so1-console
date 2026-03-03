# TASKSET 1 — Standalone Build + Repo Hygiene

Goal: guarantee `so1-console` builds and deploys from a fresh clone with no monorepo-only assumptions.

Deliverable
- No references to monorepo-only paths (e.g. `../../platform-tools/...`).
- Shared types are imported consistently from `src/shared`.
- `npm ci` + `npm run build` succeed in a clean workspace.

Primary changes
- Remove stale aliasing:
  - `next.config.ts` currently aliases `@so1/shared` to a monorepo path.
- Normalize imports:
  - Replace any remaining `@so1/shared` imports with `@/shared`.
- Lock build toolchain:
  - Ensure `package-lock.json` is committed and current.

Files/components touched
- `next.config.ts`
- `tsconfig.json`
- `src/**/*` (import cleanup)
- `package.json`
- `package-lock.json`

Verification
- Clean install: `rm -rf node_modules && npm ci`
- Build: `npm run build`
- Run: `npm run start` then visit `http://localhost:3000/sign-in`

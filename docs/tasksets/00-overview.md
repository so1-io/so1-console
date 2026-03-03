# Console Tasksets Overview

This directory captures the remaining work for `so1-console` as a set of ordered, independently verifiable TASKSETS.

Principles:
- Standalone-first: console must build/run from a fresh clone with no monorepo path assumptions.
- Consistency: auth, API calls, errors, and loading states behave the same across pages.
- Cross-repo scalable: patterns should remain valid as `so1-control-plane-api` grows.

Execution protocol:
- Do not start a TASKSET until explicit confirmation: `GO TASKSET {N}`.
- Each TASKSET includes:
  - Deliverable
  - Affected files/components
  - Verification steps

Recommended order:
1. TASKSET 1: Standalone Build + Repo Hygiene
2. TASKSET 2: Auth/Org UX Hardening
3. TASKSET 3: Same-Origin BFF Proxy + API Contract Pattern
4. TASKSET 4: Global Loading/Error UX Hardening
5. TASKSET 5: Feature MVP Wiring (Catalog/Workflows/Jobs/MCP)
6. TASKSET 6: CI Quality Gates + Operational Docs

Start:
- `docs/tasksets/01-standalone-build.md`

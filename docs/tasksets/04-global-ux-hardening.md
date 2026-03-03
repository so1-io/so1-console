# TASKSET 4 — Global Loading/Error UX Hardening

Goal: consistent, bounded loading and error handling across routes.

Deliverable
- No indefinite spinners.
- Errors are actionable (retry + clear message).

Approach
- Introduce shared UI primitives:
  - LoadingState
  - EmptyState
  - ErrorState
- Standardize React Query defaults and per-query retries.

Files/components touched
- `src/components/error-boundary.tsx`
- `src/lib/query-client.ts`
- `src/app/(auth)/*/page.tsx`

Verification
- Simulate BFF down: pages show error state within seconds.

# TASKSET 5 — Feature MVP Wiring (Catalog / Workflows / Jobs / MCP)

Goal: replace placeholders with real data where BFF supports it.

Deliverable
- Each feature route has:
  - a well-defined data hook
  - typed response shape
  - consistent empty/loading/error handling

Approach
- Add hooks:
  - `useSession()`
  - `useCatalogRepos()`
  - `useWorkflows()`
  - `useJobs()`
  - `useMcpRegistry()`

Files/components touched
- `src/app/(auth)/catalog/page.tsx`
- `src/app/(auth)/workflows/page.tsx`
- `src/app/(auth)/jobs/page.tsx`
- `src/app/(auth)/mcp/page.tsx`
- `src/lib/*`

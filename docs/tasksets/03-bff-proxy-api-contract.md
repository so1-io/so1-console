# TASKSET 3 — Same-Origin BFF Proxy + API Contract Pattern

Goal: remove direct browser calls to `control.so1.io` and standardize API usage.

Deliverable
- Browser requests use same-origin endpoints: `https://console.so1.io/api/*`.
- Console proxies to the BFF behind the scenes.
- A single client abstraction is used everywhere.

Preferred implementation
- Add a Next.js Route Handler proxy: `src/app/api/bff/[...path]/route.ts`.
- Route handler forwards to BFF base URL and attaches server-derived auth.

Contract rules
- Errors normalize to: `{ requestId, error: { code, message, details? } }`.

Files/components touched
- `src/app/api/bff/[...path]/route.ts`
- `src/lib/api-client.ts`
- `src/lib/*` (shared request/hook utilities)

Verification
- Network tab shows `/api/...` calls to console origin.
- BFF hostname does not appear in browser requests.

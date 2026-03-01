# so1-console — Agent Instructions

`so1-console` is the Next.js 16 App Router control plane UI for the so1 platform. It is a **frontend-only** application; all backend logic resides in `so1-control-plane-api` (a sibling repo).

## Key Rules

1. **Never call external services directly** from the browser. All HTTP calls go through the BFF at `/api/` routes on the same origin (proxied by `so1-control-plane-api`).
2. **Auth is server-side Clerk**. Use `auth()` from `@clerk/nextjs` in Server Components and Route Handlers; client-side uses `useAuth()`.
3. **Shared types live in `so1-shared`**. Import error envelopes, job models, and API contracts from `@so1/shared`.
4. **TanStack Query for caching**. Client-side state is managed by React Query (not Zustand or Context), with invalidation signals from the server.
5. **Error boundaries on every page**. Catch Clerk auth errors, BFF errors, and network failures gracefully.

## Repository Structure

```
src/
  app/
    (auth)/                # Clerk-protected routes (redirect if not authenticated)
      page.tsx            # Dashboard root
      layout.tsx          # Auth gate layout
    auth/                 # Clerk auth routes (login, logout, callback)
    api/
      [...]               # API route handlers (none in MVP; all go to BFF)
    error.tsx             # Global error boundary
    layout.tsx            # Root layout (theme provider, Clerk, React Query)
  components/
    ui/                   # shadcn/ui components
    error-boundary/       # Error boundary wrappers
    org-nav/              # Org switcher, user menu
    catalog/              # Catalog feature components
    workflows/            # Workflow feature components
    ops/                  # Jobs/Ops feature components
    mcp/                  # MCP registry feature components
  lib/
    api-client.ts         # BFF API client (fetch + error handling)
    auth.ts               # Auth utils
    hooks.ts              # Custom hooks (useQuery wrappers)
```

## Development

- `npm run dev` — Start Next.js dev server with hot reload
- `npm run build && npm start` — Build and start production server
- `npm run lint` — Run ESLint

## Debugging Tips

- Auth issues: check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local` and that `CLERK_SECRET_KEY` is set server-side
- BFF connectivity: verify `NEXT_PUBLIC_BFF_URL` and that `so1-control-plane-api` is running on that port
- Query cache issues: use React Query DevTools (can install `@tanstack/react-query-devtools` for debugging)

# TASKSET 2 — Auth/Org UX Hardening (Clerk)

Goal: make authentication and organization handling production-grade on `console.so1.io`.

Decision to confirm
- Is an organization required to use the console?
  - If YES: enforce org selection/creation with a dedicated route.
  - If NO: support a “personal” mode and treat `orgId` as optional.

Deliverable
- No redirect loops.
- Signed-out users land on `/sign-in`.
- Signed-in users can reach `/dashboard`.

Recommended approach
- Centralize route protection in `src/middleware.ts`.
- Avoid duplicate redirect logic in Server Components.
- Keep `src/lib/auth.ts` as read-only auth helpers.

Files/components touched
- `src/middleware.ts`
- `src/lib/auth.ts`
- `src/app/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/components/org-switcher.tsx`

Verification
- Signed out: `/` and `/dashboard` redirect to `/sign-in`.
- Signed in: `/` lands on `/dashboard`.

Operational checklist
- Clerk dashboard:
  - add `console.so1.io` domain
  - redirects include `https://console.so1.io/*`
  - production uses `pk_live` / `sk_live`

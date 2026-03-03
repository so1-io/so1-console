import { auth } from "@clerk/nextjs/server";

/**
 * Get the authenticated user info.
 * The middleware already protects routes, so this just extracts auth data.
 * This should only be called in Server Components.
 */
export async function requireAuth() {
  const { userId, orgId } = await auth();

  // Middleware handles redirect, so userId should always exist in protected routes
  // orgId may be null if user hasn't selected an organization
  return { userId: userId!, orgId: orgId || null };
}

/**
 * Get the authenticated user, or null if not authenticated.
 * This should only be called in Server Components.
 */
export async function getAuthOrNull() {
  const { userId, orgId } = await auth();
  return { userId, orgId };
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Get the authenticated user or redirect to Clerk login.
 * This should only be called in Server Components.
 */
export async function requireAuth() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  return { userId, orgId };
}

/**
 * Get the authenticated user, or null if not authenticated.
 * This should only be called in Server Components.
 */
export async function getAuthOrNull() {
  const { userId, orgId } = await auth();
  return { userId, orgId };
}

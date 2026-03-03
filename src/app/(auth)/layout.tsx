import React from "react";
import { requireAuth } from "@/lib/auth";
import { Navigation } from "@/components/navigation";
import { ErrorBoundary } from "@/components/error-boundary";

/**
 * Disable static generation for auth routes.
 * These routes require a valid Clerk session, so they must be rendered dynamically.
 */
export const dynamic = "force-dynamic";

/**
 * Layout for authenticated routes.
 * All routes under (auth) require a valid Clerk session.
 * Redirects to /sign-in if not authenticated.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await requireAuth();

  // Org name can be fetched from Clerk if needed
  const orgName = orgId ? orgId : "Personal";

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navigation orgId={orgId || ""} orgName={orgName} userId={userId} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}


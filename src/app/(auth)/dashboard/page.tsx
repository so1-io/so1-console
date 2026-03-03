"use client";

import React from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { createApiClient, ApiClientError } from "@/lib/api-client";

interface SessionData {
  userId: string;
  orgId: string;
  email?: string;
}

/**
 * Dashboard page - main entry point for authenticated users.
 * Shows user info from Clerk and optionally fetches extended session from BFF.
 */
export default function DashboardPage() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();

  // Fetch session from BFF (optional - gracefully handles BFF being down)
  const { data, isLoading, error } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token available");
      }

      const bffUrl = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:3001";
      const apiClient = createApiClient(bffUrl);

      try {
        const response = await apiClient.get<SessionData>("/api/auth/session", {
          token,
        });
        return response.data;
      } catch (err) {
        if (err instanceof ApiClientError) {
          throw new Error(`${err.code}: ${err.message}`);
        }
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Show dashboard content immediately with Clerk user data
  // BFF session data is optional enhancement
  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Welcome to so1 Console — your organization-wide control plane.
        </p>

        {/* Session info from Clerk (always available) */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-primary mb-4">
            Session Information
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-muted-foreground">
                User:
              </span>{" "}
              <code className="bg-background px-2 py-1 rounded text-foreground">
                {user?.fullName || user?.primaryEmailAddress?.emailAddress || userId}
              </code>
            </p>
            <p>
              <span className="font-medium text-muted-foreground">
                User ID:
              </span>{" "}
              <code className="bg-background px-2 py-1 rounded text-foreground">
                {userId}
              </code>
            </p>
            {/* BFF session data (if available) */}
            {isLoading && (
              <p className="text-muted-foreground italic">
                Loading extended session...
              </p>
            )}
            {error && (
              <p className="text-destructive text-xs">
                BFF unavailable: {error instanceof Error ? error.message : "Unknown error"}
              </p>
            )}
            {data?.orgId && (
              <p>
                <span className="font-medium text-muted-foreground">
                  Organization ID:
                </span>{" "}
                <code className="bg-background px-2 py-1 rounded text-foreground">
                  {data.orgId}
                </code>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/catalog" className="block bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-card-foreground mb-2">
              Catalog
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage connected repositories and their workflows.
            </p>
            <span className="text-primary text-sm font-medium">
              Go to Catalog →
            </span>
          </a>

          <a href="/workflows" className="block bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-card-foreground mb-2">
              Workflows
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage n8n workflows and automation rules.
            </p>
            <span className="text-primary text-sm font-medium">
              Go to Workflows →
            </span>
          </a>

          <a href="/jobs" className="block bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-card-foreground mb-2">
              Jobs
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor long-running jobs and operations.
            </p>
            <span className="text-primary text-sm font-medium">
              Go to Jobs →
            </span>
          </a>

          <a href="/mcp" className="block bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-card-foreground mb-2">
              MCP Registry
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore available Model Context Protocol tools and integrations.
            </p>
            <span className="text-primary text-sm font-medium">
              Go to Registry →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

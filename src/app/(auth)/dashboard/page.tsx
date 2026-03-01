"use client";

import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { createApiClient, ApiClientError } from "@/lib/api-client";

interface SessionData {
  userId: string;
  orgId: string;
  email?: string;
}

/**
 * Dashboard page - main entry point for authenticated users.
 * Fetches session from BFF and displays basic app shell.
 */
export default function DashboardPage() {
  const { getToken } = useAuth();

  // Fetch session from BFF
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
          throw new Error(`${err.code}: ${err.message} (ID: ${err.requestId})`);
        }
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Session Error</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Failed to load session"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome to so1 Console — your organization-wide control plane.
        </p>

        {data && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-4">
              Session Information
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  User ID:
                </span>{" "}
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                  {data.userId}
                </code>
              </p>
              <p>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Organization ID:
                </span>{" "}
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                  {data.orgId}
                </code>
              </p>
              {data.email && (
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Email:
                  </span>{" "}
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                    {data.email}
                  </code>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📦 Catalog
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage connected repositories and their workflows.
            </p>
            <a
              href="/catalog"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Go to Catalog →
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ⚙️ Workflows
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage n8n workflows and automation rules.
            </p>
            <a
              href="/workflows"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Go to Workflows →
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ⏳ Jobs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor long-running jobs and operations.
            </p>
            <a
              href="/jobs"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Go to Jobs →
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🧩 MCP Registry
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Explore available Model Context Protocol tools and integrations.
            </p>
            <a
              href="/mcp"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Go to Registry →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

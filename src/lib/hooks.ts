"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, ApiClientError } from "./api-client";

/**
 * Custom React Query hooks for BFF API calls.
 * These hooks automatically handle:
 * - Token acquisition from Clerk
 * - Error conversion to ApiClientError
 * - RequestId extraction from error responses
 */

const bffUrl = typeof window !== "undefined" 
  ? process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:3001"
  : "http://localhost:3001";

/**
 * Hook for GET requests to the BFF.
 */
export function useBffQuery<T = unknown>(
  path: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const apiClient = createApiClient(bffUrl);
      try {
        const response = await apiClient.get<T>(path, { token });
        return response.data;
      } catch (err) {
        if (err instanceof ApiClientError) {
          throw new Error(`${err.code}: ${err.message} (ID: ${err.requestId})`);
        }
        throw err;
      }
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 60 * 1000,
  });
}

/**
 * Hook for POST requests to the BFF.
 */
export function useBffMutation<T = unknown, V = unknown>(
  path: string,
  options?: { invalidateQueries?: string[] }
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const apiClient = createApiClient(bffUrl);
      try {
        const response = await apiClient.post<T>(path, variables, { token });
        return response.data;
      } catch (err) {
        if (err instanceof ApiClientError) {
          throw new Error(`${err.code}: ${err.message} (ID: ${err.requestId})`);
        }
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate related queries after successful mutation
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
    },
  });
}

/**
 * Hook for DELETE requests to the BFF.
 */
export function useBffDelete<T = unknown>(
  path: string,
  options?: { invalidateQueries?: string[] }
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const apiClient = createApiClient(bffUrl);
      try {
        const response = await apiClient.delete<T>(path, { token });
        return response.data;
      } catch (err) {
        if (err instanceof ApiClientError) {
          throw new Error(`${err.code}: ${err.message} (ID: ${err.requestId})`);
        }
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate related queries after successful deletion
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
    },
  });
}

import { QueryClient } from "@tanstack/react-query";

/**
 * Create a QueryClient for SSR and client-side use.
 * This is used in the root layout and in API route handlers.
 */
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

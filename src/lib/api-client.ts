import { ErrorCode } from "@so1/shared";

/**
 * BFF API client for typed, authenticated requests.
 * All requests include the Authorization header and handle errors consistently.
 */

export interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
}

export interface ApiResponse<T = unknown> {
  requestId: string;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

class ApiClientError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number,
    public requestId: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * Create an API client instance with the given base URL.
 * The base URL should point to the BFF (e.g., http://localhost:3001)
 */
export function createApiClient(baseUrl: string) {
  return {
    /**
     * Make a request to the BFF.
     * Throws ApiClientError on errors.
     */
    async request<T = unknown>(
      path: string,
      options: ApiClientOptions = {}
    ): Promise<ApiResponse<T>> {
      const {
        method = "GET",
        headers = {},
        body,
        token,
      } = options;

      const url = `${baseUrl}${path}`;
      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        } as HeadersInit,
      };

      // Add authorization header if token is provided
      if (token) {
        (fetchOptions.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }

      // Add body if provided
      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      let response: Response;
      try {
        response = await fetch(url, fetchOptions);
      } catch (error) {
        throw new ApiClientError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          `Network error: ${error instanceof Error ? error.message : String(error)}`,
          0,
          "unknown",
          { originalError: String(error) }
        );
      }

      let data: ApiResponse<T>;
      try {
        data = await response.json();
      } catch (error) {
        throw new ApiClientError(
          ErrorCode.INTERNAL_SERVER_ERROR,
          "Failed to parse response JSON",
          response.status,
          "unknown",
          { originalError: String(error), status: response.status }
        );
      }

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new ApiClientError(
          data.error?.code || ErrorCode.INTERNAL_SERVER_ERROR,
          data.error?.message || `HTTP ${response.status}`,
          response.status,
          data.requestId || "unknown",
          data.error?.details
        );
      }

      return data;
    },

    /**
     * Make a GET request to the BFF.
     */
    async get<T = unknown>(path: string, options?: Omit<ApiClientOptions, "method" | "body">) {
      return this.request<T>(path, { ...options, method: "GET" });
    },

    /**
     * Make a POST request to the BFF.
     */
    async post<T = unknown>(
      path: string,
      body?: unknown,
      options?: Omit<ApiClientOptions, "method" | "body">
    ) {
      return this.request<T>(path, { ...options, method: "POST", body });
    },

    /**
     * Make a PUT request to the BFF.
     */
    async put<T = unknown>(
      path: string,
      body?: unknown,
      options?: Omit<ApiClientOptions, "method" | "body">
    ) {
      return this.request<T>(path, { ...options, method: "PUT", body });
    },

    /**
     * Make a DELETE request to the BFF.
     */
    async delete<T = unknown>(path: string, options?: Omit<ApiClientOptions, "method" | "body">) {
      return this.request<T>(path, { ...options, method: "DELETE" });
    },
  };
}

// Export the error class for use in catch blocks
export { ApiClientError };


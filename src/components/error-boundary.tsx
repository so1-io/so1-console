"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, resetError: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  requestId?: string;
}

/**
 * Error boundary component that catches errors in child components
 * and displays them with the requestId for debugging.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      requestId: undefined,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error) {
    // Extract requestId from error message if available
    const match = error.message.match(/requestId:\s*([a-f0-9-]+)/i);
    const requestId = match ? match[1] : undefined;

    this.setState({ requestId });

    // Log to console for debugging
    console.error("ErrorBoundary caught:", error);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      requestId: undefined,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-destructive/5 p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-destructive/20 p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {this.state.error.message}
                </p>
                {this.state.requestId && (
                  <div className="bg-gray-50 rounded p-2 mb-4">
                    <p className="text-xs font-mono text-gray-500">
                      <span className="text-gray-700">Request ID:</span>{" "}
                      {this.state.requestId}
                    </p>
                  </div>
                )}
                <button
                  onClick={this.resetError}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component for using ErrorBoundary with async Server Components.
 */
export function ErrorBoundaryAsync({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: (error: Error, resetError: () => void) => React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

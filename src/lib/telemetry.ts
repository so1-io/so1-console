"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Telemetry utilities for observability.
 * These are hook points for integrating with OpenTelemetry in the future.
 */

/**
 * Hook for tracking page views and navigation events.
 */
export function useTelemetry() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Track page view when pathname changes
    if (previousPathRef.current !== pathname) {
      trackPageView(pathname);
      previousPathRef.current = pathname;
    }
  }, [pathname]);

  return {
    trackEvent,
    trackError,
    trackPerformance,
  };
}

/**
 * Track a page view.
 * Hook point for OpenTelemetry integration.
 */
export function trackPageView(pathname: string) {
  // TODO: Integrate with OpenTelemetry when available
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Telemetry] Page view: ${pathname}`);
  }

  // Send to analytics service if configured
  if (typeof window !== "undefined" && window.__telemetry) {
    window.__telemetry.trackPageView({
      pathname,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track a custom event.
 * Hook point for OpenTelemetry integration.
 */
export function trackEvent(
  eventName: string,
  attributes?: Record<string, unknown>
) {
  // TODO: Integrate with OpenTelemetry when available
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Telemetry] Event: ${eventName}`, attributes);
  }

  // Send to analytics service if configured
  if (typeof window !== "undefined" && window.__telemetry) {
    window.__telemetry.trackEvent({
      name: eventName,
      attributes,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track an error for observability.
 * Hook point for OpenTelemetry integration.
 */
export function trackError(
  error: Error,
  context?: Record<string, unknown>
) {
  // TODO: Integrate with OpenTelemetry when available
  if (process.env.NODE_ENV === "development") {
    console.error(`[Telemetry] Error: ${error.message}`, error, context);
  }

  // Send to error tracking service if configured
  if (typeof window !== "undefined" && window.__telemetry) {
    window.__telemetry.trackError({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track performance metrics.
 * Hook point for OpenTelemetry integration.
 */
export function trackPerformance(
  metricName: string,
  duration: number,
  attributes?: Record<string, unknown>
) {
  // TODO: Integrate with OpenTelemetry when available
  if (process.env.NODE_ENV === "development") {
    console.debug(
      `[Telemetry] Performance: ${metricName} - ${duration}ms`,
      attributes
    );
  }

  // Send to metrics service if configured
  if (typeof window !== "undefined" && window.__telemetry) {
    window.__telemetry.trackPerformance({
      name: metricName,
      duration,
      attributes,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Hook for measuring performance of async operations.
 */
export function usePerformanceTracking(operationName: string) {
  const startTimeRef = useRef<number | undefined>(undefined);

  const start = () => {
    startTimeRef.current = performance.now();
  };

  const end = (attributes?: Record<string, unknown>) => {
    if (startTimeRef.current !== undefined) {
      const duration = performance.now() - startTimeRef.current;
      trackPerformance(operationName, duration, attributes);
      startTimeRef.current = undefined;
    }
  };

  return { start, end };
}

/**
 * Global telemetry interface for window object.
 * This allows external telemetry systems to be injected at runtime.
 */
declare global {
  interface Window {
    __telemetry?: {
      trackPageView(data: Record<string, unknown>): void;
      trackEvent(data: Record<string, unknown>): void;
      trackError(data: Record<string, unknown>): void;
      trackPerformance(data: Record<string, unknown>): void;
    };
  }
}

import { redirect } from "next/navigation";

/**
 * Disable static generation for the home page.
 * This page performs redirect logic and should be rendered dynamically.
 */
export const dynamic = "force-dynamic";

/**
 * Home page - always redirects to dashboard.
 * Authentication is handled by middleware.
 */
export default async function Home() {
  redirect("/dashboard");
}

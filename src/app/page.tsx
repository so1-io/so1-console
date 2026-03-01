import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Disable static generation for the home page.
 * This page performs authentication logic and should be rendered dynamically.
 */
export const dynamic = "force-dynamic";

/**
 * Home page - redirects to dashboard if authenticated, or to sign-in if not.
 */
export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  redirect("/dashboard");
}

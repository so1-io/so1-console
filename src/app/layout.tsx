import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ClientProviders } from "@/lib/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "so1 Console",
  description: "Organization-wide control plane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClientProviders>
              {children}
              <Toaster position="top-right" />
            </ClientProviders>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

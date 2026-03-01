"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { OrgSwitcher } from "./org-switcher";

interface NavigationProps {
  orgId: string;
  orgName?: string;
  userId: string;
}

/**
 * Main navigation component for the app shell.
 * Includes org switcher, nav links, and user menu.
 */
export function Navigation({ orgId, orgName, userId }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/catalog", label: "Catalog", icon: "📦" },
    { href: "/workflows", label: "Workflows", icon: "⚙️" },
    { href: "/jobs", label: "Jobs", icon: "⏳" },
    { href: "/mcp", label: "MCP Registry", icon: "🧩" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="flex-shrink-0">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            so1
          </span>
        </Link>

        {/* Org Switcher */}
        <div className="ml-4 border-l border-gray-200 dark:border-gray-800 pl-4">
          <OrgSwitcher currentOrgId={orgId} currentOrgName={orgName} />
        </div>

        {/* Center Navigation Links */}
        <div className="flex items-center gap-1 ml-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Settings + User Menu */}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/settings"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>

          <div className="border-l border-gray-200 dark:border-gray-800 pl-2 ml-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface OrgSwitcherProps {
  currentOrgId: string;
  currentOrgName?: string;
  onOrgChange?: (orgId: string) => void;
}

/**
 * Organization switcher dropdown component.
 * Shows the current org and allows switching between orgs.
 * 
 * TODO: Connect to actual org list from BFF when available.
 */
export function OrgSwitcher({
  currentOrgId,
  currentOrgName = "My Organization",
  onOrgChange,
}: OrgSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Mock organizations for now
  const organizations = [
    { id: currentOrgId, name: currentOrgName },
    // Additional orgs would be fetched from BFF in future
  ];

  const handleOrgChange = (orgId: string) => {
    setIsOpen(false);
    onOrgChange?.(orgId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {currentOrgName}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50">
          <div className="py-1">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrgChange(org.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  org.id === currentOrgId
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

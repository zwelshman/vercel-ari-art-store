"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "text-purple-700 dark:text-purple-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-700"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.icon}</span>
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

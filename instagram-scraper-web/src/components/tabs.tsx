"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
  children: (activeTab: string) => React.ReactNode;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  children,
}: TabsProps) {
  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
  };

  return (
    <div>
      <div className="flex gap-8 bg-white/20 backdrop-blur-sm rounded-2xl p-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-[#dc6c6f] shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-[#dc6c6f] text-white"
                    : "bg-white/20"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {children(activeTab)}
    </div>
  );
}

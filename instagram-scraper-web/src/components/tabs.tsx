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
      <div className="flex gap-2 md:gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex flex-col md:flex-row items-center justify-center flex-1 min-w-[80px] md:min-w-[120px] py-2 px-4 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-[#dc6c6f] shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-xs md:text-sm md:py-2">{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`mt-1 md:mt-0 md:ml-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full ${
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

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export function ProfileTabs<T extends string>({ tabs, activeTab, onChange }: ProfileTabsProps<T>) {
  return (
    <div className="w-full flex h-14 overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-100 bg-slate-50/50 p-1.5 shadow-inner hide-scrollbar">
      <div className="flex w-full items-center h-full gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={cn(
                "relative flex h-full flex-1 items-center justify-center whitespace-nowrap px-6 rounded-xl text-[13px] font-black uppercase tracking-widest transition-all duration-300",
                isActive 
                  ? "bg-white text-blue-600 shadow-sm shadow-blue-100" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-white/40"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

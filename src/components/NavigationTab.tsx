import React from 'react';
import { TabType } from '../types';

interface NavigationTabProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'routes', label: 'Routes', icon: 'alt_route' },
    { id: 'suggest', label: 'Suggest', icon: 'lightbulb' },
    { id: 'community', label: 'Community', icon: 'emoji_events' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav
      aria-label="Main application tabs"
      className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#cfdaf2]/50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-xl mx-auto flex justify-between items-center h-18 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-xl transition-all gap-0.5 ${
                isActive
                  ? 'text-[#006194] font-bold bg-[#cce5ff]/50 shadow-xs'
                  : 'text-[#3f4850] hover:text-[#111c2d] hover:bg-[#e7eeff]/60'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] tracking-tight truncate text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

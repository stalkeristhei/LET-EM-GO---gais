import React from 'react';
import { CompanionMode, TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  subView?: string;
  companionMode: CompanionMode;
  onToggleCompanionMode: (mode: CompanionMode) => void;
  onOpenSos: () => void;
  onGoToProfile: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  subView,
  companionMode,
  onToggleCompanionMode,
  onOpenSos,
  onGoToProfile,
  onBack,
  showBack,
}) => {
  const getScreenTitle = () => {
    if (subView === 'live-nav') return 'Live Navigation';
    if (subView === 'venue-detail') return 'Venue Access';
    switch (currentTab) {
      case 'explore':
        return 'Explore Map';
      case 'routes':
        return 'Routes';
      case 'suggest':
        return 'Suggest Box';
      case 'community':
        return 'Community Leagues';
      case 'profile':
        return 'User Profile';
      default:
        return 'Routes';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 pt-safe bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#cfdaf2]/50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-xl mx-auto px-4 flex items-center justify-between gap-2">
        {/* Left: Logo & Title or Back Button */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              type="button"
              aria-label="Go Back"
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] -ml-1 rounded-full flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div className="flex items-center gap-2 min-w-0">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WDx8MZxruu28BFSDEyYlQzodFM4gOf48CqBdmT4sS23lLe-5vR6WBJ7ADaUHseQxB6OnLYuGcPvXwyaB4zga-PuxeeAun0LRr3fUw4XQIzixiwCwTP5dkYELKKuAYJCwROJwGFyv9s_NA5tvLEe3iALo2Injwyl5FAAudnmS27vJh-UbW_owgWHu5ekun2DRbjtGSdPBCXi6E4QAn8KeEZhEJ--UPrQg-HoHTTIkEh54HvVQ2NMxveuvP6"
              alt="LET 'EM GO Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#006194] uppercase tracking-wider truncate">
                LET 'EM GO
              </span>
              <span className="text-[18px] font-bold text-[#111c2d] leading-tight truncate">
                {getScreenTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Companion Mode + SOS + Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Companion Mode Toggle */}
          <div
            role="group"
            aria-label="Travel Companion Mode Toggle"
            className="flex items-center p-1 bg-[#e7eeff] rounded-full"
          >
            <button
              type="button"
              aria-pressed={companionMode === 'solo'}
              onClick={() => onToggleCompanionMode('solo')}
              className={`min-h-[38px] px-2.5 py-1 rounded-full font-bold text-[12px] flex items-center gap-1 transition-all ${
                companionMode === 'solo'
                  ? 'bg-[#263143] text-[#ecf1ff] shadow-sm'
                  : 'text-[#3f4850] hover:text-[#111c2d]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">person</span>
              <span>Solo</span>
            </button>
            <button
              type="button"
              aria-pressed={companionMode === 'pa'}
              onClick={() => onToggleCompanionMode('pa')}
              className={`min-h-[38px] px-2.5 py-1 rounded-full font-bold text-[12px] flex items-center gap-1 transition-all ${
                companionMode === 'pa'
                  ? 'bg-[#263143] text-[#ecf1ff] shadow-sm'
                  : 'text-[#3f4850] hover:text-[#111c2d]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">group</span>
              <span>PA</span>
            </button>
          </div>

          {/* Emergency SOS Button */}
          <button
            type="button"
            aria-label="Emergency SOS Assistance"
            onClick={onOpenSos}
            className="min-w-[42px] min-h-[42px] px-2 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center font-bold text-[12px] shadow-[0_2px_6px_rgba(186,26,26,0.35)] hover:bg-[#93000a] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">sos</span>
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            aria-label="View user profile"
            onClick={onGoToProfile}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#006194] focus:ring-offset-2"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCwRtQOa9wefapiaFBnQaM6RAVqTOGzWwWxkkYKsBoc0ukwRmHHju90fu_aR4KGCOtiaKxMbk4Zn0rgdtzQCjBV_oFDGc-mz9eLwWtL-yD8gNCJEbZUjAFc751wecVHQeJLNm2Ps9N5H2HK3g6i1a9NxRP9OjLKQUnGbtnCwjZeI-hgqi9fc2WaEvWJXRG9fcOP4L_Js5b4lzIHnevABSqZAX9MqdNDkNTbv0vhB8WFqnXud4rQXIDWg"
              alt="Elena Rostova Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#006194]/20 hover:scale-105 transition-transform"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

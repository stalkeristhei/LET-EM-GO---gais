import React from 'react';
import { UserProfileData, CompanionMode } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData;
  onUpdateProfile: (updated: Partial<UserProfileData>) => void;
  companionMode: CompanionMode;
  onToggleCompanionMode: (mode: CompanionMode) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  companionMode,
  onToggleCompanionMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111c2d]/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-[#ffffff] rounded-2xl shadow-2xl border border-[#cfdaf2] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#f0f3ff] border-b border-[#cfdaf2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-[24px]">tune</span>
            <h2 id="filter-modal-title" className="text-[18px] font-bold text-[#111c2d]">
              Accessibility Filter Criteria
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Filter Settings"
            className="w-10 h-10 rounded-full hover:bg-[#dee8ff] flex items-center justify-center text-[#111c2d] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filter Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Active Companion Mode Switch */}
          <div className="bg-[#f0f3ff] p-3.5 rounded-xl">
            <label className="text-[13px] font-bold text-[#111c2d] block mb-2">
              Routing Travel Companion Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleCompanionMode('solo')}
                className={`py-2 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border transition-all ${
                  companionMode === 'solo'
                    ? 'bg-[#263143] text-white border-[#263143] shadow-sm'
                    : 'bg-white text-[#3f4850] border-[#cfdaf2] hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Solo Autonomous</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleCompanionMode('pa')}
                className={`py-2 px-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 border transition-all ${
                  companionMode === 'pa'
                    ? 'bg-[#263143] text-white border-[#263143] shadow-sm'
                    : 'bg-white text-[#3f4850] border-[#cfdaf2] hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>PA Accompanied</span>
              </button>
            </div>
            <p className="text-[11px] text-[#3f4850] mt-2">
              {companionMode === 'solo'
                ? 'Strictly step-free with 0% slope assistance required, auto doors, level turns.'
                : 'Permits slopes up to 8% with assistant support, manual doors with companion push.'}
            </p>
          </div>

          {/* Max Slope Incline Tolerance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#111c2d]">
              <span>Max Safe Incline Slope:</span>
              <span className="text-[#006194] bg-[#dee8ff] px-2 py-0.5 rounded-md">
                ≤ {userProfile.maxSlopeTolerance}% Grade
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={userProfile.maxSlopeTolerance}
              onChange={(e) => onUpdateProfile({ maxSlopeTolerance: parseInt(e.target.value) })}
              className="w-full accent-[#006194] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#707881]">
              <span>0% (Flat only)</span>
              <span>5% (ADA standard)</span>
              <span>10% (Steep)</span>
            </div>
          </div>

          {/* Minimum Doorway Width */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#111c2d]">
              <span>Minimum Doorway Clearance:</span>
              <span className="text-[#006194] bg-[#dee8ff] px-2 py-0.5 rounded-md">
                {userProfile.minDoorWidth} cm
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[75, 80, 90, 100].map((width) => (
                <button
                  key={width}
                  type="button"
                  onClick={() => onUpdateProfile({ minDoorWidth: width })}
                  className={`py-2 rounded-lg font-bold text-[12px] border ${
                    userProfile.minDoorWidth === width
                      ? 'bg-[#006194] text-white border-[#006194]'
                      : 'bg-[#f0f3ff] text-[#111c2d] border-[#cfdaf2] hover:bg-[#dee8ff]'
                  }`}
                >
                  {width} cm
                </button>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[20px]">
                  accessible_forward
                </span>
                <span className="text-[13px] font-bold text-[#111c2d]">Zero-Step Guarantee</span>
              </div>
              <input
                type="checkbox"
                checked={userProfile.stepTolerance.includes('0')}
                onChange={(e) =>
                  onUpdateProfile({
                    stepTolerance: e.target.checked
                      ? 'Strictly 0 steps'
                      : '1-2 steps with handrail',
                  })
                }
                className="w-5 h-5 accent-[#006194]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[20px]">
                  hearing
                </span>
                <span className="text-[13px] font-bold text-[#111c2d]">
                  Auditory Crosswalk Signals
                </span>
              </div>
              <input
                type="checkbox"
                checked={userProfile.audioSignals}
                onChange={(e) => onUpdateProfile({ audioSignals: e.target.checked })}
                className="w-5 h-5 accent-[#006194]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d4b00] text-[20px]">
                  psychology
                </span>
                <span className="text-[13px] font-bold text-[#111c2d]">
                  Low-Sensory / Quiet Corridors
                </span>
              </div>
              <input
                type="checkbox"
                checked={userProfile.lowSensory}
                onChange={(e) => onUpdateProfile({ lowSensory: e.target.checked })}
                className="w-5 h-5 accent-[#006194]"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f0f3ff] border-t border-[#cfdaf2] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onUpdateProfile({
                maxSlopeTolerance: 5,
                minDoorWidth: 85,
                stepTolerance: 'Strictly 0 steps',
                audioSignals: true,
                lowSensory: true,
              });
            }}
            className="text-[13px] text-[#006194] underline font-bold"
          >
            Reset to Defaults
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#006194] text-white font-bold text-[14px] hover:bg-[#007bb9] active:scale-98 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

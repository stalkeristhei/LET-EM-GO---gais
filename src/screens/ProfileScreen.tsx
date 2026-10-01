import React, { useState } from 'react';
import { UserProfileData } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfileData;
  onUpdateProfile: (updated: Partial<UserProfileData>) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onUpdateProfile,
  onShowToast,
}) => {
  const [editingCompanion, setEditingCompanion] = useState(false);
  const [companionNameInput, setCompanionNameInput] = useState(userProfile.companionName);
  const [companionPhoneInput, setCompanionPhoneInput] = useState(userProfile.companionPhone);

  const mobilityOptions = [
    { id: 'Powerchair (Quickie Q500)', icon: 'accessible_forward', label: 'Powerchair' },
    { id: 'Manual Wheelchair', icon: 'accessible', label: 'Manual Chair' },
    { id: 'Mobility Scooter', icon: 'electric_scooter', label: 'Scooter' },
    { id: 'Walking Frame / Crutches', icon: 'elderly', label: 'Frame / Crutches' },
    { id: 'Guide Dog / White Cane', icon: 'blind', label: 'Visual Guide' },
  ];

  const handleSaveCompanion = () => {
    onUpdateProfile({
      companionName: companionNameInput,
      companionPhone: companionPhoneInput,
    });
    setEditingCompanion(false);
    onShowToast('Companion PA information updated!', 'verified');
  };

  const handleExportPassport = () => {
    onShowToast('Offline Mobility Passport downloaded to device!', 'download_done');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-4 max-w-xl mx-auto space-y-4">
      {/* Profile Header */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] flex items-center gap-3.5">
        <div className="relative shrink-0">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-[#006194]/20"
          />
          <span className="absolute -bottom-1 -right-1 bg-[#006c4a] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-[11px] shadow-sm ring-2 ring-white">
            {userProfile.level}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold text-[#111c2d] truncate">{userProfile.name}</h1>
          <p className="text-[12px] text-[#707881]">{userProfile.handle}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-[#82f5c1] text-[#00714e] text-[11px] font-bold px-2 py-0.5 rounded-full">
              {userProfile.role}
            </span>
            <span className="text-[12px] text-[#006194] font-semibold">
              {userProfile.accessPoints.toLocaleString()} AP
            </span>
          </div>
        </div>
      </section>

      {/* Equipment & Mobility Gear */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-[22px]">
              accessible_forward
            </span>
            <h2 className="text-[16px] font-bold text-[#111c2d]">Equipment & Mobility Type</h2>
          </div>
          <span className="text-[11px] font-bold text-[#006c4a] bg-[#82f5c1] px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mobilityOptions.map((opt) => {
            const isSelected = userProfile.mobilityType.includes(opt.label);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onUpdateProfile({ mobilityType: opt.id });
                  onShowToast(`Equipment set to: ${opt.label}`, 'check');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-[#cce5ff] border-[#006194] text-[#001d31] font-bold shadow-xs'
                    : 'bg-[#f0f3ff] border-[#cfdaf2] text-[#3f4850] hover:bg-[#dee8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px] shrink-0 select-none">
                  {opt.icon}
                </span>
                <span className="text-[13px] leading-tight truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Spatial Tolerance Limits */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006194] text-[22px]">square_foot</span>
          <h2 className="text-[16px] font-bold text-[#111c2d]">Spatial Thresholds</h2>
        </div>

        {/* Slope grade slider */}
        <div className="space-y-1 bg-[#f0f3ff] p-3 rounded-xl border border-[#cfdaf2]">
          <div className="flex items-center justify-between text-[13px] font-bold text-[#111c2d]">
            <span>Maximum Incline Slope:</span>
            <span className="text-[#006194] bg-[#dee8ff] px-2 py-0.5 rounded-md">
              ≤ {userProfile.maxSlopeTolerance}%
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={userProfile.maxSlopeTolerance}
            onChange={(e) => onUpdateProfile({ maxSlopeTolerance: parseInt(e.target.value) })}
            className="w-full accent-[#006194] cursor-pointer"
          />
          <p className="text-[11px] text-[#707881]">
            Routes exceeding this slope will require personal assistant confirmation.
          </p>
        </div>

        {/* Door width selector */}
        <div className="space-y-1.5 bg-[#f0f3ff] p-3 rounded-xl border border-[#cfdaf2]">
          <div className="flex items-center justify-between text-[13px] font-bold text-[#111c2d]">
            <span>Minimum Door Clearance:</span>
            <span className="text-[#006194] bg-[#dee8ff] px-2 py-0.5 rounded-md">
              {userProfile.minDoorWidth} cm
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[75, 80, 85, 90].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onUpdateProfile({ minDoorWidth: w })}
                className={`py-1.5 rounded-lg font-bold text-[12px] border ${
                  userProfile.minDoorWidth === w
                    ? 'bg-[#006194] text-white border-[#006194]'
                    : 'bg-white text-[#111c2d] border-[#cfdaf2] hover:bg-[#dee8ff]'
                }`}
              >
                {w} cm
              </button>
            ))}
          </div>
        </div>

        {/* Sensory toggles */}
        <div className="space-y-2 pt-1">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] cursor-pointer border border-[#cfdaf2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[20px]">
                hearing
              </span>
              <span className="text-[13px] font-bold text-[#111c2d]">
                Audible Traffic Crossings
              </span>
            </div>
            <input
              type="checkbox"
              checked={userProfile.audioSignals}
              onChange={(e) => onUpdateProfile({ audioSignals: e.target.checked })}
              className="w-5 h-5 accent-[#006194]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] cursor-pointer border border-[#cfdaf2]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4a] text-[20px]">
                psychology
              </span>
              <span className="text-[13px] font-bold text-[#111c2d]">
                Low-Sensory / Quiet Routing
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
      </section>

      {/* Personal Assistant (PA) Pairing */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006194] text-[22px]">group</span>
            <h2 className="text-[16px] font-bold text-[#111c2d]">Companion (PA) Pairing</h2>
          </div>
          <button
            type="button"
            onClick={() => setEditingCompanion(!editingCompanion)}
            className="text-[12px] font-bold text-[#006194] hover:underline"
          >
            {editingCompanion ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingCompanion ? (
          <div className="space-y-2 bg-[#f0f3ff] p-3 rounded-xl border border-[#cfdaf2]">
            <div>
              <label className="text-[11px] font-bold text-[#707881] block">Assistant Name</label>
              <input
                type="text"
                value={companionNameInput}
                onChange={(e) => setCompanionNameInput(e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-[#cfdaf2] text-[13px] font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#707881] block">Assistant Phone</label>
              <input
                type="tel"
                value={companionPhoneInput}
                onChange={(e) => setCompanionPhoneInput(e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-[#cfdaf2] text-[13px] font-medium"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveCompanion}
              className="w-full py-2 bg-[#006194] text-white rounded-lg font-bold text-[13px] hover:bg-[#007bb9]"
            >
              Save Assistant Info
            </button>
          </div>
        ) : (
          <div className="bg-[#f0f3ff] p-3 rounded-xl border border-[#cfdaf2] flex items-center justify-between">
            <div>
              <p className="font-bold text-[14px] text-[#111c2d]">{userProfile.companionName}</p>
              <p className="text-[12px] text-[#707881]">{userProfile.companionPhone}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-bold text-[11px]">
              Paired
            </span>
          </div>
        )}
      </section>

      {/* Offline Mobility Passport */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006194] text-[22px]">badge</span>
          <h2 className="text-[16px] font-bold text-[#111c2d]">Digital Mobility Passport</h2>
        </div>
        <p className="text-[12px] text-[#3f4850] leading-snug">
          Export an encrypted QR code and PDF card displaying your powerchair dimensions, battery type, and transfer guidelines for airport, rail, and venue security.
        </p>
        <button
          type="button"
          onClick={handleExportPassport}
          className="w-full min-h-[46px] rounded-xl bg-[#dee8ff] hover:bg-[#cce5ff] text-[#006194] font-bold text-[13px] flex items-center justify-center gap-2 transition-all border border-[#cfdaf2]"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download Offline Mobility Passport</span>
        </button>
      </section>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { UserProfileData, GoaRegion } from '../types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData;
  currentRegion?: GoaRegion;
  onTriggerHelp: (action: string) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  currentRegion = 'panjim',
  onTriggerHelp,
}) => {
  const [sirenActive, setSirenActive] = useState(false);
  const [dispatchRequested, setDispatchRequested] = useState(false);

  // Play audio beacon beep if sirenActive
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sirenActive) {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        interval = setInterval(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.16);
        }, 500);
      } catch {
        // audio context not allowed without prior user interaction or in background
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sirenActive]);

  if (!isOpen) return null;

  const regionLocation =
    currentRegion === 'panjim'
      ? {
          address: 'Dayanand Bandodkar Marg, Panaji, Goa (Near Mandovi River)',
          coords: '15.4909° N, 73.8278° E · Goa Sidewalk RTK Lock',
        }
      : currentRegion === 'porvorim'
      ? {
          address: 'NH66 Corridor, Porvorim, Goa (Opposite Mall De Goa)',
          coords: '15.5348° N, 73.8291° E · Goa Sidewalk RTK Lock',
        }
      : {
          address: 'Market Road, Morod, Mapusa, Goa (Near Municipal Market)',
          coords: '15.5937° N, 73.8142° E · Goa Sidewalk RTK Lock',
        };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111c2d]/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-lg bg-[#ffffff] rounded-2xl shadow-2xl border-2 border-[#ba1a1a] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Alert */}
        <div className="bg-[#ba1a1a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] animate-pulse">sos</span>
            <div>
              <h2 id="sos-modal-title" className="text-[20px] font-bold leading-tight">
                Emergency Accessibility Support
              </h2>
              <p className="text-[12px] text-white/90">
                Goa State Accessible Escort, Transit & Audio Beacon
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSirenActive(false);
              onClose();
            }}
            aria-label="Close Emergency Window"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-[20px] transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {/* Real-time GPS Location Lock in Goa */}
          <div className="bg-[#f0f3ff] rounded-xl p-3.5 border border-[#cfdaf2] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#006194] text-[24px] shrink-0 mt-0.5">
              my_location
            </span>
            <div className="flex-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#006194] block">
                Current Locked Location ({currentRegion.toUpperCase()})
              </span>
              <p className="text-[15px] font-bold text-[#111c2d]">
                {regionLocation.address}
              </p>
              <p className="text-[12px] text-[#3f4850] mt-0.5">
                {regionLocation.coords}
              </p>
            </div>
          </div>

          {/* Primary Dispatch Action */}
          <div className="bg-[#ffdad6] rounded-xl p-4 border border-[#ba1a1a]/30">
            <h3 className="text-[16px] font-bold text-[#93000a] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
              1-Touch Accessible Transit Escort
            </h3>
            <p className="text-[13px] text-[#93000a]/90 mb-3">
              Alerts local accessible station agents and mobile barrier clearance team with your powerchair specifications in {currentRegion.toUpperCase()}.
            </p>

            {dispatchRequested ? (
              <div className="bg-white rounded-lg p-3 text-[#006c4a] border border-[#82f5c1] flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <div>
                  <p className="font-bold text-[14px]">Goa Escort Unit Dispatched!</p>
                  <p className="text-[12px] text-[#006c4a]">
                    ETA 5 minutes. KTC Accessible Van #08 dispatched to your coordinates.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDispatchRequested(true);
                  onTriggerHelp(`Transit escort requested in ${currentRegion.toUpperCase()}`);
                }}
                className="w-full min-h-[48px] py-2.5 px-4 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">hail</span>
                <span>Dispatch Urgent Ramp / Escort Unit</span>
              </button>
            )}
          </div>

          {/* Quick Contact Dials */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${userProfile.companionPhone}`}
              onClick={() => onTriggerHelp(`Calling Personal Assistant: ${userProfile.companionName}`)}
              className="bg-[#f0f3ff] hover:bg-[#e7eeff] p-3 rounded-xl border border-[#cfdaf2] flex flex-col gap-1 transition-all active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-[#006194]">
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span className="text-[12px] font-bold uppercase">Call Companion (PA)</span>
              </div>
              <p className="text-[14px] font-bold text-[#111c2d] truncate">
                {userProfile.companionName}
              </p>
              <span className="text-[11px] text-[#3f4850]">{userProfile.companionPhone}</span>
            </a>

            <a
              href={`tel:${userProfile.emergencyContactPhone}`}
              onClick={() => onTriggerHelp('Calling Goa 112 Careline')}
              className="bg-[#f0f3ff] hover:bg-[#e7eeff] p-3 rounded-xl border border-[#cfdaf2] flex flex-col gap-1 transition-all active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                <span className="text-[12px] font-bold uppercase">Goa Careline</span>
              </div>
              <p className="text-[14px] font-bold text-[#111c2d] truncate">
                112 / Social Welfare
              </p>
              <span className="text-[11px] text-[#3f4850]">24/7 Accessible Help</span>
            </a>
          </div>

          {/* Audible Beacon / Siren Option */}
          <div className="bg-[#dee8ff] p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#006194] text-[24px]">
                {sirenActive ? 'volume_up' : 'volume_mute'}
              </span>
              <div>
                <p className="font-bold text-[14px] text-[#111c2d]">Audible Proximity Beacon</p>
                <p className="text-[12px] text-[#3f4850]">Helps guides locate you in crowded areas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSirenActive(!sirenActive)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${
                sirenActive
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#ffffff] text-[#006194] shadow-xs'
              }`}
            >
              {sirenActive ? 'Stop Siren' : 'Sound Beacon'}
            </button>
          </div>

          {/* Mobility Profile Snapshot */}
          <div className="bg-[#f0f3ff] p-3 rounded-xl text-[12px] text-[#3f4850] space-y-1">
            <span className="font-bold text-[#111c2d] block uppercase tracking-wider text-[11px]">
              Active Medical & Equipment ID
            </span>
            <p>• User: {userProfile.name} ({userProfile.mobilityType})</p>
            <p>• Chapter: {userProfile.chapter} (Panaji / North Goa)</p>
            <p>• Max safe incline: ≤ {userProfile.maxSlopeTolerance}% · Min door clearance: {userProfile.minDoorWidth}cm</p>
            <p>• Step Tolerance: {userProfile.stepTolerance}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f0f3ff] border-t border-[#cfdaf2] flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              setSirenActive(false);
              onClose();
            }}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#263143] text-white font-bold text-[14px] hover:bg-[#111c2d] transition-all"
          >
            Dismiss SOS
          </button>
        </div>
      </div>
    </div>
  );
};

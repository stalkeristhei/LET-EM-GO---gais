import React, { useState } from 'react';
import { UserProfileData, UserBadge } from '../types';
import { COMMUNITY_LEAGUE_MEMBERS } from '../data/mockData';

interface CommunityScreenProps {
  userProfile: UserProfileData;
  badges: UserBadge[];
  onGoToProfile: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onAddPoints: (points: number) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  userProfile,
  badges,
  onGoToProfile,
  onShowToast,
  onAddPoints,
}) => {
  const [hasMappedNearby, setHasMappedNearby] = useState(false);
  const [cityProgress, setCityProgress] = useState(78);

  const handleHelpMap = () => {
    if (hasMappedNearby) {
      onShowToast('Nearby Fontainhas queue already updated!', 'check_circle');
      return;
    }
    setHasMappedNearby(true);
    setCityProgress(80);
    onAddPoints(15);
    onShowToast('3 curb ramps mapped in Fontainhas! +15 AP added.', 'add_location_alt');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-4 max-w-xl mx-auto space-y-4">
      {/* 1. User Profile & Gamification Identity Banner */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2] relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-[#006194]/20"
            />
            <span
              aria-label={`Tier Level ${userProfile.level}`}
              className="absolute -bottom-1 -right-1 bg-[#006c4a] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-[11px] shadow-sm ring-2 ring-white"
            >
              {userProfile.level}
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-[20px] font-bold text-[#111c2d] truncate">
                {userProfile.name}
              </h1>
              <span className="bg-[#82f5c1] text-[#00714e] px-2 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">military_tech</span>
                {userProfile.role}
              </span>
            </div>
            <p className="text-[12px] text-[#3f4850] flex items-center gap-1 mt-0.5 font-medium">
              <span className="material-symbols-outlined text-[15px] text-[#006194]">verified</span>
              <span>Level {userProfile.level} Contributor • {userProfile.chapter}</span>
            </p>
          </div>
        </div>

        {/* Triple-Coded Stats Overview */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 bg-[#f0f3ff] rounded-xl p-2 border border-[#cfdaf2]">
          <div className="bg-white rounded-lg p-2.5 flex flex-col justify-center border border-[#cfdaf2]/60">
            <div className="flex items-center gap-1 text-[#006194]">
              <span className="material-symbols-outlined text-[17px]">stars</span>
              <span className="text-[11px] font-bold uppercase tracking-wide">Access Points</span>
            </div>
            <span className="text-[20px] text-[#111c2d] font-bold mt-0.5">
              {userProfile.accessPoints.toLocaleString()}{' '}
              <span className="text-[12px] text-[#707881] font-semibold">AP</span>
            </span>
          </div>

          <div className="bg-white rounded-lg p-2.5 flex flex-col justify-center border border-[#cfdaf2]/60">
            <div className="flex items-center gap-1 text-[#006c4a]">
              <span className="material-symbols-outlined text-[17px]">fact_check</span>
              <span className="text-[11px] font-bold uppercase tracking-wide">Impact Score</span>
            </div>
            <span className="text-[20px] text-[#006c4a] font-bold mt-0.5">
              {userProfile.impactScore}%
            </span>
          </div>

          <div className="bg-white rounded-lg p-2.5 flex flex-col justify-center border border-[#cfdaf2]/60">
            <div className="flex items-center gap-1 text-[#3f4850]">
              <span className="material-symbols-outlined text-[17px]">place</span>
              <span className="text-[11px] font-bold uppercase tracking-wide">Locations</span>
            </div>
            <span className="text-[17px] font-bold text-[#111c2d] mt-0.5">
              {userProfile.locationsVerified}{' '}
              <span className="text-[11px] text-[#707881] font-normal">Verified</span>
            </span>
          </div>

          <div className="bg-white rounded-lg p-2.5 flex flex-col justify-center border border-[#cfdaf2]/60">
            <div className="flex items-center gap-1 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[17px]">report_problem</span>
              <span className="text-[11px] font-bold uppercase tracking-wide">Hazards</span>
            </div>
            <span className="text-[17px] font-bold text-[#111c2d] mt-0.5">
              {userProfile.hazardsCleared}{' '}
              <span className="text-[11px] text-[#707881] font-normal">Cleared</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Active Weekly League Widget */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffdcc3] text-[#2f1500] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">emoji_events</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8d4b00] uppercase tracking-wider block">
                Active Weekly League
              </span>
              <h2 className="text-[17px] font-bold text-[#111c2d]">Goa & Coastal League</h2>
            </div>
          </div>
          <div className="bg-[#dee8ff] px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 text-[#111c2d] border border-[#cfdaf2]">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            <span className="font-bold text-[11px]">2 days left</span>
          </div>
        </div>

        <div className="bg-[#f0f3ff] rounded-xl p-2.5 text-[#3f4850] text-[12px] mb-3 flex items-center gap-2 border border-[#cfdaf2]">
          <span className="material-symbols-outlined text-[#006194] text-[18px]">info</span>
          <span>Top 3 advance to the Regional Vanguard League on Sunday.</span>
        </div>

        {/* Leaderboard Stack */}
        <div role="list" aria-label="League Leaderboard Standings" className="flex flex-col gap-1.5">
          {COMMUNITY_LEAGUE_MEMBERS.map((member) => {
            const isUser = member.isUser;
            return (
              <div
                key={member.rank}
                role="listitem"
                aria-current={isUser ? 'true' : undefined}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                  isUser
                    ? 'bg-[#cce5ff]/50 border-[#006194]/40 shadow-xs'
                    : 'bg-[#f0f3ff] border-[#cfdaf2]/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full font-bold text-[13px] flex items-center justify-center shrink-0 ${
                      member.rank === 1
                        ? 'bg-[#ffdcc3] text-[#2f1500]'
                        : isUser
                        ? 'bg-[#006194] text-white'
                        : 'bg-[#e7eeff] text-[#111c2d]'
                    }`}
                  >
                    {member.rank}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13px] text-[#111c2d] truncate">
                        {member.name}
                      </span>
                      {isUser && (
                        <span className="bg-[#006194] text-white font-bold text-[9px] px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] ${
                        isUser ? 'text-[#006194] font-semibold' : 'text-[#707881]'
                      }`}
                    >
                      {member.tier}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 shrink-0 font-bold ${
                    isUser ? 'text-[#006194] text-[17px]' : 'text-[#111c2d] text-[14px]'
                  }`}
                >
                  <span>{isUser ? userProfile.accessPoints.toLocaleString() : member.ap.toLocaleString()}</span>
                  <span className="text-[11px] font-normal text-[#707881]">AP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Earned Badges Showcase */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]">
              verified_user
            </span>
            <h2 className="text-[17px] font-bold text-[#111c2d]">Earned Badges</h2>
          </div>
          <span className="text-[12px] text-[#707881] font-semibold">2 of 4 Active</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className="bg-[#f0f3ff] p-3 rounded-xl flex flex-col justify-between h-36 border border-[#cfdaf2]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      b.badgeType === 'emerald'
                        ? 'bg-[#82f5c1] text-[#00714e]'
                        : b.badgeType === 'amber'
                        ? 'bg-[#ffdcc3] text-[#2f1500]'
                        : 'bg-[#e7eeff] text-[#006194]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{b.icon}</span>
                  </span>
                  {b.earned ? (
                    <span className="bg-[#006c4a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Earned
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-[#006194]">
                      {b.progressText.split('(')[1]?.replace(')', '') || 'Active'}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-[13px] text-[#111c2d] mt-2 leading-tight">
                  {b.name}
                </h3>
                <p className="text-[11px] text-[#707881] mt-0.5 leading-snug">
                  {b.progressText.split('(')[0]}
                </p>
              </div>

              <div>
                <div className="w-full bg-[#d8e3fb] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${b.earned ? 'bg-[#006c4a]' : 'bg-[#006194]'}`}
                    style={{ width: `${b.progressPercent}%` }}
                  />
                </div>
                {b.remainingText && (
                  <span className="text-[10px] text-[#707881] font-medium mt-1 block">
                    {b.remainingText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. City Mapping Live Progress */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006194] text-[20px]">
              location_city
            </span>
            <h2 className="text-[17px] font-bold text-[#111c2d]">Panaji City Progress</h2>
          </div>
          <span className="font-bold text-[14px] text-[#006194]">{cityProgress}%</span>
        </div>

        <div className="w-full bg-[#dee8ff] h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-[#006194] h-full rounded-full transition-all duration-700"
            style={{ width: `${cityProgress}%` }}
          />
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f0f3ff] text-[#3f4850] mb-3 border border-[#cfdaf2]">
          <span className="material-symbols-outlined text-[#8d4b00] text-[20px] shrink-0">
            notification_important
          </span>
          <p className="text-[12px] leading-snug">
            <strong className="text-[#111c2d]">14 locations</strong> need wheelchair ramp & elevator verification today near Fontainhas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleHelpMap}
          className="w-full min-h-[48px] bg-[#006194] text-white rounded-xl p-2.5 font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#007bb9] active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
          <span>{hasMappedNearby ? 'Verification Submitted ✓' : 'Help Map Nearby'}</span>
          <span className="bg-[#cce5ff] text-[#001d31] text-[11px] px-2 py-0.5 rounded-full font-bold">
            +15 AP
          </span>
        </button>
      </section>

      {/* 5. Private Accessibility Profile Quick Card */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#cfdaf2]">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#dee8ff] text-[#111c2d] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#111c2d]">My Accessibility Profile</h2>
              <span className="text-[12px] text-[#707881]">Private travel requirements</span>
            </div>
          </div>
          <span className="bg-[#85f8c4] text-[#002114] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">lock</span> Active
          </span>
        </div>

        {/* Requirements Tag Bar */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <div className="bg-[#f0f3ff] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[#111c2d] text-[11px] font-bold border border-[#cfdaf2]">
            <span className="material-symbols-outlined text-[#006194] text-[15px]">
              accessible_forward
            </span>
            <span>Wheelchair / Step-Free</span>
          </div>
          <div className="bg-[#f0f3ff] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[#111c2d] text-[11px] font-bold border border-[#cfdaf2]">
            <span className="material-symbols-outlined text-[#006c4a] text-[15px]">visibility</span>
            <span>High-Contrast Cues</span>
          </div>
          <div className="bg-[#f0f3ff] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[#111c2d] text-[11px] font-bold border border-[#cfdaf2]">
            <span className="material-symbols-outlined text-[#8d4b00] text-[15px]">hearing</span>
            <span>Audio Signals</span>
          </div>
          <div className="bg-[#f0f3ff] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[#111c2d] text-[11px] font-bold border border-[#cfdaf2]">
            <span className="material-symbols-outlined text-[#006194] text-[15px]">psychology</span>
            <span>Low-Sensory Routes</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToProfile}
          className="w-full min-h-[46px] bg-[#f0f3ff] text-[#006194] rounded-xl p-2.5 font-bold text-[13px] flex items-center justify-between px-3.5 hover:bg-[#dee8ff] transition-colors border border-[#cfdaf2]"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">manage_accounts</span>
            <span>Edit Mobility, Vision & Sensory Needs</span>
          </span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </section>
    </div>
  );
};

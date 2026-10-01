import React, { useState, useEffect } from 'react';
import { LocationSpot, CompanionMode, GoaRegion } from '../types';
import { GOA_REGIONS } from '../data/mockData';

interface ExploreScreenProps {
  companionMode: CompanionMode;
  currentRegion: GoaRegion;
  onChangeRegion: (region: GoaRegion) => void;
  onToggleCompanionMode: () => void;
  onOpenFilters: () => void;
  onSelectPlaceForNav: (spot: LocationSpot) => void;
  onViewVenueDetail: (spotId: string) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onAddPoints: (points: number) => void;
  onGoToSuggest: () => void;
  spots: LocationSpot[];
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  companionMode,
  currentRegion,
  onChangeRegion,
  onOpenFilters,
  onSelectPlaceForNav,
  onViewVenueDetail,
  onShowToast,
  onAddPoints,
  onGoToSuggest,
  spots,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('step-free');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'contrast'>('standard');
  const [verifiedSpot, setVerifiedSpot] = useState<boolean>(false);

  // Filter spots by active region
  const regionSpots = spots.filter((s) => s.region === currentRegion);
  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    regionSpots[0]?.id || spots[0].id
  );

  // When region changes, select the primary spot in that region
  useEffect(() => {
    const firstInRegion = spots.find((s) => s.region === currentRegion);
    if (firstInRegion) {
      setSelectedSpotId(firstInRegion.id);
    }
  }, [currentRegion, spots]);

  const currentSpot =
    spots.find((s) => s.id === selectedSpotId) ||
    regionSpots[0] ||
    spots[0];

  const activeRegionMeta =
    GOA_REGIONS.find((r) => r.id === currentRegion) || GOA_REGIONS[0];

  const handleVoiceSearch = () => {
    setIsListening(true);
    onShowToast(`Listening for accessible spots in ${activeRegionMeta.name}...`, 'mic');
    setTimeout(() => {
      const foundSpot = regionSpots[0] || spots[0];
      setSearchQuery(`${foundSpot.name}, ${activeRegionMeta.name}`);
      setIsListening(false);
      setSelectedSpotId(foundSpot.id);
      onShowToast(`Location locked: ${foundSpot.name}`, 'search_check');
    }, 1700);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    if (query.includes('porvorim') || query.includes('mall') || query.includes('assembly')) {
      onChangeRegion('porvorim');
      const spot = spots.find((s) => s.region === 'porvorim');
      if (spot) setSelectedSpotId(spot.id);
      onShowToast('Switched to Porvorim-Goa Radar', 'explore');
    } else if (query.includes('mapusa') || query.includes('market') || query.includes('bodgeshwar')) {
      onChangeRegion('mapusa');
      const spot = spots.find((s) => s.region === 'mapusa');
      if (spot) setSelectedSpotId(spot.id);
      onShowToast('Switched to Mapusa-Goa Radar', 'explore');
    } else if (query.includes('panjim') || query.includes('panaji') || query.includes('bodega') || query.includes('library')) {
      onChangeRegion('panjim');
      const spot = spots.find((s) => s.region === 'panjim');
      if (spot) setSelectedSpotId(spot.id);
      onShowToast('Switched to Panjim-Goa Radar', 'explore');
    } else {
      // Find matching spot by name across all spots
      const matched = spots.find(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.address.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      );
      if (matched) {
        onChangeRegion(matched.region);
        setSelectedSpotId(matched.id);
        onShowToast(`Found: ${matched.name} in ${matched.region.toUpperCase()}`, 'place');
      } else {
        onShowToast(`No matching spot found. Showing spots in ${activeRegionMeta.name}`, 'info');
      }
    }
  };

  const handleVerifyPrompt = () => {
    if (verifiedSpot) {
      onShowToast('Already confirmed accurate for today!', 'check_circle');
      return;
    }
    setVerifiedSpot(true);
    onAddPoints(10);
    onShowToast(`Spot verified accurate! +10 AP earned for ${currentSpot.name}`, 'verified');
  };

  const handleShareSpot = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentSpot.name} (${activeRegionMeta.name})`,
        text: `Accessibility verification: ${currentSpot.confidenceScore}% verified in ${activeRegionMeta.name}, Goa.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onShowToast('Accessible link copied to clipboard!', 'share');
    }
  };

  // Region-specific hazard
  const regionHazard = regionSpots.find((s) => s.markerType === 'hazard');

  return (
    <div className="flex flex-col w-full gap-4 pb-28 pt-20 px-4 max-w-xl mx-auto">
      {/* 1. Goa Region Fast Selector (Panjim · Porvorim · Mapusa) */}
      <section aria-label="Goa Territory Region Select" className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006194] text-[18px]">location_on</span>
            <span className="text-[12px] font-bold text-[#006194] uppercase tracking-wider">
              Goa Accessibility Radar
            </span>
          </div>
          <span className="text-[11px] text-[#707881] font-semibold">{activeRegionMeta.latLon}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#e7eeff] rounded-2xl border border-[#cfdaf2]">
          {GOA_REGIONS.map((reg) => {
            const isActive = currentRegion === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  onChangeRegion(reg.id);
                  onShowToast(`Centered on ${reg.name} Accessibility Grid`, 'explore');
                }}
                className={`py-2 px-1.5 rounded-xl font-bold text-[12px] flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#006194] text-white shadow-sm scale-[1.02]'
                    : 'text-[#3f4850] hover:text-[#111c2d] hover:bg-white/60'
                }`}
              >
                <span className="leading-tight truncate w-full text-center">
                  {reg.id === 'panjim' ? '🌴 Panjim' : reg.id === 'porvorim' ? '🏛️ Porvorim' : '🛍️ Mapusa'}
                </span>
                <span
                  className={`text-[9.5px] font-medium leading-tight truncate w-full text-center ${
                    isActive ? 'text-[#cce5ff]' : 'text-[#707881]'
                  }`}
                >
                  {reg.id === 'panjim' ? 'Waterfront' : reg.id === 'porvorim' ? 'Highway/Mall' : 'Market/Transit'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive Top Search Module */}
      <section aria-label="Search destination" className="flex flex-col gap-1">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full min-h-[56px] rounded-xl bg-white shadow-sm border border-[#cfdaf2]"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute left-3.5 text-[#006194] text-[24px] pointer-events-none"
          >
            search
          </span>
          <input
            id="search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeRegionMeta.name} or type 'Porvorim'/'Mapusa'...`}
            aria-label="Search destination in Goa"
            className="w-full h-full min-h-[56px] pl-11 pr-24 rounded-xl bg-transparent text-[14px] font-medium text-[#111c2d] placeholder:text-[#707881] focus:outline-none"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              id="audio-input-btn"
              type="button"
              onClick={handleVoiceSearch}
              aria-label="Voice input destination"
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-transform active:scale-95 ${
                isListening
                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                  : 'bg-[#e7eeff] hover:bg-[#dee8ff] text-[#006194]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">mic</span>
            </button>
            <button
              type="button"
              onClick={onOpenFilters}
              aria-label="Filter accessibility traits"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#cce5ff] text-[#001d31] hover:bg-[#93ccff] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Travel Companion Mode Banner */}
      <section
        aria-label="Travel companion mode status"
        className="flex flex-col rounded-xl bg-[#dee8ff] p-4 shadow-sm border border-[#cfdaf2]"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[#006194] text-[24px]"
            >
              {companionMode === 'solo' ? 'person' : 'group'}
            </span>
            <span className="font-bold text-[16px] text-[#111c2d]">
              Active Mode: {companionMode === 'solo' ? 'Solo 🧍' : 'PA Assist 👥'}
            </span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              companionMode === 'solo'
                ? 'bg-[#006c4a] text-white'
                : 'bg-[#006194] text-white'
            }`}
          >
            {companionMode === 'solo' ? 'High Autonomy' : 'Accompanied'}
          </span>
        </div>

        <p className="text-[13px] text-[#3f4850] leading-snug">
          {companionMode === 'solo'
            ? `Showing independently accessible places in ${activeRegionMeta.name} verified with step-free entrances, power-assist doors, and level turns.`
            : `Assisted mode active for ${activeRegionMeta.name}: permits inclines up to 8% with assistant support and companion restroom transfers.`}
        </p>

        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#cfdaf2]/60">
          <span className="text-[12px] font-bold text-[#006194] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            {companionMode === 'solo'
              ? 'Filters set for 0% slope assist required'
              : 'Filters set for companion-supported routing'}
          </span>
          <button
            type="button"
            onClick={onOpenFilters}
            className="text-[12px] font-bold text-[#111c2d] hover:text-[#006194] underline min-h-[36px] flex items-center"
          >
            Configure Filters
          </button>
        </div>
      </section>

      {/* 4. Quick Action Accessibility Radar Categories */}
      <section aria-label="Quick Category Filters" className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[15px] text-[#111c2d]">
            Radar Filters ({activeRegionMeta.name})
          </h2>
          <span className="text-[12px] text-[#3f4850] font-semibold">
            {currentRegion === 'panjim' ? '32 Spots' : currentRegion === 'porvorim' ? '28 Spots' : '24 Spots'}
          </span>
        </div>

        {/* Horizontally scrollable chip row */}
        <div
          role="region"
          aria-label="Category chips list"
          className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar"
        >
          {/* Parking */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'parking'}
            onClick={() => {
              setSelectedFilter('parking');
              const parkingSpot = regionSpots.find((s) => s.markerType === 'parking');
              if (parkingSpot) setSelectedSpotId(parkingSpot.id);
            }}
            className={`shrink-0 min-h-[46px] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 transition-all active:scale-95 ${
              selectedFilter === 'parking'
                ? 'bg-[#006194] text-white'
                : 'bg-white text-[#111c2d] hover:bg-[#e7eeff] border border-[#cfdaf2]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">local_parking</span>
            <span className="text-[13px] font-bold whitespace-nowrap">Accessible Parking</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                selectedFilter === 'parking' ? 'bg-white/20 text-white' : 'bg-[#cce5ff] text-[#001d31]'
              }`}
            >
              {currentRegion === 'panjim' ? '14' : currentRegion === 'porvorim' ? '12' : '8'}
            </span>
          </button>

          {/* Washrooms */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'washrooms'}
            onClick={() => {
              setSelectedFilter('washrooms');
              const safeSpot = regionSpots.find((s) => s.markerType === 'safe');
              if (safeSpot) setSelectedSpotId(safeSpot.id);
            }}
            className={`shrink-0 min-h-[46px] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 transition-all active:scale-95 ${
              selectedFilter === 'washrooms'
                ? 'bg-[#006194] text-white'
                : 'bg-white text-[#111c2d] hover:bg-[#e7eeff] border border-[#cfdaf2]'
            }`}
          >
            <span className="material-symbols-outlined text-[#006c4a] text-[19px]">wc</span>
            <span className="text-[13px] font-bold whitespace-nowrap">Accessible Washrooms</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                selectedFilter === 'washrooms' ? 'bg-white/20 text-white' : 'bg-[#82f5c1] text-[#002114]'
              }`}
            >
              {currentRegion === 'panjim' ? '9' : currentRegion === 'porvorim' ? '11' : '6'}
            </span>
          </button>

          {/* Step-Free Places */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'step-free'}
            onClick={() => {
              setSelectedFilter('step-free');
              const safeSpot = regionSpots.find((s) => s.markerType === 'safe');
              if (safeSpot) setSelectedSpotId(safeSpot.id);
            }}
            className={`shrink-0 min-h-[46px] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 transition-all active:scale-95 ${
              selectedFilter === 'step-free'
                ? 'bg-[#006194] text-white'
                : 'bg-white text-[#111c2d] hover:bg-[#e7eeff] border border-[#cfdaf2]'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">accessible_forward</span>
            <span className="text-[13px] font-bold whitespace-nowrap">Step-Free Places</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                selectedFilter === 'step-free' ? 'bg-white/20 text-white' : 'bg-[#cce5ff] text-[#001d31]'
              }`}
            >
              {currentRegion === 'panjim' ? '21' : currentRegion === 'porvorim' ? '18' : '15'}
            </span>
          </button>

          {/* Verified Routes */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'routes'}
            onClick={() => {
              setSelectedFilter('routes');
              const warnSpot = regionSpots.find((s) => s.markerType === 'warning');
              if (warnSpot) setSelectedSpotId(warnSpot.id);
            }}
            className={`shrink-0 min-h-[46px] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 transition-all active:scale-95 ${
              selectedFilter === 'routes'
                ? 'bg-[#006194] text-white'
                : 'bg-white text-[#111c2d] hover:bg-[#e7eeff] border border-[#cfdaf2]'
            }`}
          >
            <span className="material-symbols-outlined text-[#8d4b00] text-[19px]">timeline</span>
            <span className="text-[13px] font-bold whitespace-nowrap">Verified Routes</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                selectedFilter === 'routes' ? 'bg-white/20 text-white' : 'bg-[#ffdcc3] text-[#2f1500]'
              }`}
            >
              5
            </span>
          </button>

          {/* Suggest Improvement */}
          <button
            type="button"
            onClick={onGoToSuggest}
            className="shrink-0 min-h-[46px] px-3.5 py-1.5 rounded-full bg-[#dee8ff] text-[#006194] border border-[#cfdaf2] shadow-sm hover:bg-[#cce5ff] flex items-center gap-1.5 text-[13px] font-bold active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[19px]">add_location_alt</span>
            <span className="whitespace-nowrap">Suggest Spot</span>
          </button>
        </div>
      </section>

      {/* 5. Interactive Map Canvas / Live Radar View tailored for Goa Region */}
      <section
        aria-label="Interactive map representation"
        className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-md border border-[#cfdaf2]"
      >
        {/* Stylized High-Contrast Canvas with Region Context */}
        <div
          className={`w-full h-full relative transition-all duration-300 ${
            activeLayer === 'contrast' ? 'filter contrast-125 saturate-150' : ''
          }`}
          style={{
            transform: `scale(${mapZoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Base Vector Canvas for Goa Region */}
          <div className="absolute inset-0 bg-[#e7eeff]">
            {/* Waterways / Coastal line */}
            <svg
              className="w-full h-full"
              viewBox="0 0 400 360"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {currentRegion === 'panjim' && (
                <>
                  {/* Mandovi River Estuary */}
                  <path
                    d="M 0 40 Q 120 70, 240 50 T 400 70 L 400 0 L 0 0 Z"
                    fill="#cce5ff"
                  />
                  {/* Atal Setu & Mandovi Bridges */}
                  <line x1="260" y1="50" x2="310" y2="0" stroke="#006194" strokeWidth="4" />
                  <line x1="280" y1="55" x2="330" y2="0" stroke="#707881" strokeWidth="2.5" strokeDasharray="3" />
                  {/* Miramar Coast */}
                  <path
                    d="M 0 40 C 40 120, 60 220, 100 360 L 0 360 Z"
                    fill="#93ccff"
                    opacity="0.6"
                  />
                  {/* Roads / Main Corridors */}
                  <path
                    d="M 100 340 Q 140 220, 180 120 T 360 80"
                    stroke="#ffffff"
                    strokeWidth="8"
                    fill="none"
                  />
                  <path
                    d="M 100 340 Q 140 220, 180 120 T 360 80"
                    stroke="#cfdaf2"
                    strokeWidth="5"
                    fill="none"
                  />
                  {/* Fontainhas Latin Quarter grid */}
                  <rect x="210" y="160" width="70" height="60" rx="6" fill="#f0f3ff" stroke="#cfdaf2" />
                  <text x="215" y="150" fontSize="10" fontWeight="bold" fill="#006194">Fontainhas Quarter</text>
                  <text x="110" y="330" fontSize="10" fontWeight="bold" fill="#006194">Miramar Beach Promenade</text>
                  <text x="20" y="25" fontSize="10" fontWeight="bold" fill="#004b73">Mandovi River ⛵</text>
                </>
              )}

              {currentRegion === 'porvorim' && (
                <>
                  {/* NH66 Highway Spine */}
                  <path
                    d="M 200 360 L 200 0"
                    stroke="#ffffff"
                    strokeWidth="16"
                    fill="none"
                  />
                  <path
                    d="M 200 360 L 200 0"
                    stroke="#006194"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="8 4"
                  />
                  {/* Chogm Road cross connector */}
                  <path
                    d="M 20 180 Q 120 190, 200 180 T 380 160"
                    stroke="#ffffff"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Assembly Complex on hill */}
                  <rect x="260" y="70" width="100" height="70" rx="8" fill="#f0f3ff" stroke="#006194" strokeWidth="1.5" />
                  <text x="265" y="62" fontSize="10" fontWeight="bold" fill="#006194">Goa Assembly Hill 🏛️</text>
                  {/* Mall De Goa zone */}
                  <rect x="60" y="110" width="110" height="65" rx="8" fill="#82f5c1" opacity="0.3" stroke="#006c4a" strokeWidth="1.5" />
                  <text x="65" y="102" fontSize="10" fontWeight="bold" fill="#006c4a">Mall De Goa Complex 🛍️</text>
                  <text x="140" y="340" fontSize="10" fontWeight="bold" fill="#707881">NH66 to Atal Setu ➔</text>
                </>
              )}

              {currentRegion === 'mapusa' && (
                <>
                  {/* Mapusa Radial Roads */}
                  <circle cx="200" cy="170" r="45" fill="#f0f3ff" stroke="#006194" strokeWidth="2" />
                  <line x1="200" y1="0" x2="200" y2="360" stroke="#ffffff" strokeWidth="8" />
                  <line x1="0" y1="170" x2="400" y2="170" stroke="#ffffff" strokeWidth="8" />
                  {/* Municipal Market Arcade */}
                  <rect x="170" y="140" width="60" height="60" rx="6" fill="#85f8c4" opacity="0.4" stroke="#006c4a" strokeWidth="1.5" />
                  <text x="135" y="130" fontSize="10" fontWeight="bold" fill="#006c4a">Mapusa Municipal Market 🧺</text>
                  {/* Bodgeshwar Temple green zone */}
                  <circle cx="300" cy="90" r="30" fill="#ffdcc3" opacity="0.5" stroke="#b15f00" strokeWidth="1.5" />
                  <text x="260" y="55" fontSize="10" fontWeight="bold" fill="#b15f00">Bodgeshwar Temple 🛕</text>
                  {/* Bus Station area */}
                  <rect x="50" y="170" width="70" height="50" rx="6" fill="#ffdad6" opacity="0.4" stroke="#ba1a1a" strokeWidth="1.5" />
                  <text x="50" y="162" fontSize="10" fontWeight="bold" fill="#ba1a1a">KTC Bus Station 🚌</text>
                </>
              )}
            </svg>
          </div>

          {/* Interactive Dynamic Pins for Current Region */}
          {regionSpots.map((spot) => {
            const isSelected = spot.id === selectedSpotId;
            const isHazard = spot.markerType === 'hazard';
            const isParking = spot.markerType === 'parking';
            const isWarning = spot.markerType === 'warning';

            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setSelectedSpotId(spot.id)}
                aria-label={`${spot.name}: ${spot.confidenceScore}% verified`}
                className="absolute flex flex-col items-center group cursor-pointer focus:outline-none transition-transform"
                style={{
                  top: `${spot.coords.y}%`,
                  left: `${spot.coords.x}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Floating Label Pill */}
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] shadow-md transition-all whitespace-nowrap ${
                    isSelected
                      ? isHazard
                        ? 'bg-[#ba1a1a] text-white ring-2 ring-white scale-105'
                        : isParking
                        ? 'bg-[#006194] text-white ring-2 ring-white scale-105'
                        : isWarning
                        ? 'bg-[#b15f00] text-white ring-2 ring-white scale-105'
                        : 'bg-[#006c4a] text-white ring-2 ring-white scale-105'
                      : 'bg-white text-[#111c2d] border border-[#cfdaf2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isHazard ? 'report' : isParking ? 'local_parking' : isWarning ? 'warning' : 'check_circle'}
                  </span>
                  <span>{spot.badgeLabel || spot.name.split(' ')[0]}</span>
                </div>

                {/* Pin Circle */}
                <div
                  className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center mt-1 transform transition-all text-white ${
                    isHazard
                      ? 'bg-[#ba1a1a] animate-bounce ring-4 ring-[#ffdad6]'
                      : isParking
                      ? 'bg-[#006194] ring-2 ring-white'
                      : isWarning
                      ? 'bg-[#b15f00] ring-2 ring-white'
                      : 'bg-[#006c4a] ring-4 ring-[#82f5c1]'
                  } ${isSelected ? 'scale-115' : 'hover:scale-110'}`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {isHazard
                      ? 'report'
                      : isParking
                      ? 'local_parking'
                      : isWarning
                      ? 'accessible'
                      : spot.category.includes('Bakery') || spot.category.includes('Café')
                      ? 'local_cafe'
                      : spot.category.includes('Mall')
                      ? 'shopping_bag'
                      : 'domain'}
                  </span>
                </div>

                {/* Arrow Pointer */}
                <div
                  className={`w-2 h-2 rotate-45 -mt-1 ${
                    isHazard ? 'bg-[#ba1a1a]' : isParking ? 'bg-[#006194]' : isWarning ? 'bg-[#b15f00]' : 'bg-[#006c4a]'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#cfdaf2] flex items-center gap-2">
            <span aria-hidden="true" className="flex h-2.5 w-2.5 rounded-full bg-[#006c4a] animate-pulse" />
            <span className="font-bold text-[12px] text-[#111c2d]">
              {activeRegionMeta.name} • GPS Locked
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMapZoom(1);
              const firstSpot = regionSpots[0];
              if (firstSpot) setSelectedSpotId(firstSpot.id);
              onShowToast(`GPS Recentered on ${activeRegionMeta.name} (${activeRegionMeta.landmark})`, 'my_location');
            }}
            aria-label="Recenter map to current location"
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-white text-[#006194] shadow-md flex items-center justify-center border border-[#cfdaf2] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">my_location</span>
          </button>
        </div>

        {/* Live Map Layer & Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveLayer(activeLayer === 'standard' ? 'contrast' : 'standard');
              onShowToast(
                activeLayer === 'standard'
                  ? 'High-Contrast Incline Surface Layer enabled'
                  : 'Standard Map Layer enabled',
                'layers'
              );
            }}
            aria-label="Toggle Surface Contrast View"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white shadow-md flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] border border-[#cfdaf2] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          <button
            type="button"
            onClick={() => setMapZoom(mapZoom >= 1.4 ? 1 : mapZoom + 0.2)}
            aria-label="Zoom in map"
            className="min-w-[44px] min-h-[44px] rounded-full bg-white shadow-md flex items-center justify-center text-[#111c2d] hover:bg-[#dee8ff] border border-[#cfdaf2] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mapZoom >= 1.4 ? 'zoom_out' : 'add'}
            </span>
          </button>
        </div>
      </section>

      {/* 6. Active Barrier Alert Strip for Region */}
      {regionHazard && (
        <div
          role="alert"
          onClick={() => setSelectedSpotId(regionHazard.id)}
          className="flex items-start gap-3 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] shadow-sm border border-[#ba1a1a]/30 cursor-pointer hover:bg-[#ffcdca] transition-colors"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[#ba1a1a] text-[24px] shrink-0 mt-0.5"
          >
            report
          </span>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[13px]">{regionHazard.name}</span>
              <span className="text-[11px] opacity-85">{regionHazard.lastAudited}</span>
            </div>
            <p className="text-[12px] leading-snug mt-0.5">
              {regionHazard.soloEvaluation.details}
            </p>
          </div>
        </div>
      )}

      {/* 7. Bottom Drawer Preview Card of Selected Place */}
      <section
        id="selected-place-drawer"
        aria-label="Selected venue preview details"
        className="flex flex-col rounded-2xl bg-white p-4 shadow-md border border-[#cfdaf2] gap-3.5"
      >
        {/* Card Header with Distance, Name, and Confidence Score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#82f5c1] text-[#002114] font-bold text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">distance</span>
                {currentSpot.distance}
              </span>
              <span className="text-[12px] text-[#707881] font-semibold">
                {currentSpot.category}
              </span>
            </div>
            <h3 className="text-[19px] font-bold text-[#111c2d] truncate mt-1">
              {currentSpot.name}
            </h3>
            <p className="text-[13px] text-[#3f4850] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[15px] text-[#006194]">pin_drop</span>
              <span>{currentSpot.address} • {currentSpot.hours}</span>
            </p>
          </div>

          {/* Verified Confidence Badge */}
          <div className="flex flex-col items-end shrink-0">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-white shadow-sm ${
                currentSpot.confidenceScore >= 90
                  ? 'bg-[#006c4a]'
                  : currentSpot.confidenceScore >= 70
                  ? 'bg-[#b15f00]'
                  : 'bg-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span className="font-bold text-[15px]">{currentSpot.confidenceScore}%</span>
            </div>
            <span className="text-[11px] text-[#707881] text-right mt-1">
              {currentSpot.verificationsCount} verifications
            </span>
          </div>
        </div>

        {/* Confidence Track Bar */}
        <div aria-label="Accessibility verification confidence bar" className="flex flex-col gap-1">
          <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                currentSpot.confidenceScore >= 90
                  ? 'bg-[#006c4a]'
                  : currentSpot.confidenceScore >= 70
                  ? 'bg-[#b15f00]'
                  : 'bg-[#ba1a1a]'
              }`}
              style={{ width: `${currentSpot.confidenceScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#707881] font-medium">
            <span>
              {currentSpot.confidenceScore >= 90 ? 'High Confidence Status' : 'Conditional Access'}
            </span>
            <span>{currentSpot.lastAudited}</span>
          </div>
        </div>

        {/* Solo vs PA Physical Accessibility Breakdown */}
        <div className="grid grid-cols-1 gap-2">
          {/* Solo Evaluation Row */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f0f3ff] border border-[#cfdaf2]">
            <div className="w-8 h-8 rounded-full bg-[#006c4a] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[13px] text-[#111c2d]">Solo Autonomous:</span>
                <span
                  className={`px-2 py-0.2 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                    currentSpot.soloEvaluation.status === 'Accessible'
                      ? 'bg-[#82f5c1] text-[#002114]'
                      : currentSpot.soloEvaluation.status === 'Caution'
                      ? 'bg-[#ffdcc3] text-[#2f1500]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {currentSpot.soloEvaluation.status === 'Accessible' ? 'check' : 'warning'}
                  </span>
                  {currentSpot.soloEvaluation.status}
                </span>
              </div>
              <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                {currentSpot.soloEvaluation.details}
              </p>
            </div>
          </div>

          {/* PA Evaluation Row */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f0f3ff] border border-[#cfdaf2]">
            <div className="w-8 h-8 rounded-full bg-[#cce5ff] text-[#001d31] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[13px] text-[#111c2d]">Companion (PA):</span>
                <span
                  className={`px-2 py-0.2 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                    currentSpot.paEvaluation.status === 'Accessible'
                      ? 'bg-[#82f5c1] text-[#002114]'
                      : 'bg-[#ffdcc3] text-[#2f1500]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">check</span>
                  {currentSpot.paEvaluation.status}
                </span>
              </div>
              <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                {currentSpot.paEvaluation.details}
              </p>
            </div>
          </div>
        </div>

        {/* Staff Assistance & Sensory Snapshot */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#dee8ff] border border-[#cfdaf2]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-[#8d4b00] text-[22px] shrink-0">
              grade
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[13px] text-[#111c2d] truncate">
                Staff Accessibility Rating
              </span>
              <span className="text-[12px] text-[#3f4850] truncate">{currentSpot.staffNotes}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white shadow-xs border border-[#cfdaf2] shrink-0">
            <span
              className="material-symbols-outlined text-[#8d4b00] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-bold text-[14px] text-[#111c2d]">{currentSpot.staffRating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectPlaceForNav(currentSpot)}
            className="w-full min-h-[50px] px-4 py-2.5 rounded-xl bg-[#006194] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#007bb9] active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">navigation</span>
            <span>Start Accessible Route in {activeRegionMeta.name}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewVenueDetail(currentSpot.id)}
              className="w-full min-h-[46px] px-3 py-2 rounded-xl bg-[#e7eeff] hover:bg-[#dee8ff] text-[#111c2d] font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors border border-[#cfdaf2]"
            >
              <span className="material-symbols-outlined text-[#006194] text-[19px]">
                assignment_turned_in
              </span>
              <span>Full Profile</span>
            </button>
            <button
              type="button"
              onClick={handleShareSpot}
              className="w-full min-h-[46px] px-3 py-2 rounded-xl bg-[#e7eeff] hover:bg-[#dee8ff] text-[#111c2d] font-bold text-[13px] flex items-center justify-center gap-1.5 transition-colors border border-[#cfdaf2]"
            >
              <span className="material-symbols-outlined text-[#006194] text-[19px]">
                share_location
              </span>
              <span>Share Spot</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Community Micro-Prompt */}
      <section className="flex items-center justify-between p-3.5 rounded-xl bg-[#82f5c1] text-[#002114] shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[26px] text-[#002114] shrink-0"
          >
            emoji_people
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[13px] text-[#002114] truncate">
              Are you at {currentSpot.name}?
            </span>
            <span className="text-[12px] text-[#005137] truncate">
              Help update automated door status!
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleVerifyPrompt}
          className="min-h-[44px] px-4 rounded-xl bg-white text-[#111c2d] font-bold text-[13px] shadow-sm hover:bg-[#f9f9ff] active:scale-95 transition-all shrink-0 ml-2"
        >
          {verifiedSpot ? 'Verified ✓' : 'Verify'}
        </button>
      </section>
    </div>
  );
};

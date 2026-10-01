import React, { useState } from 'react';
import { LocationSpot, CompanionMode } from '../types';

interface ExploreScreenProps {
  companionMode: CompanionMode;
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
  onToggleCompanionMode,
  onOpenFilters,
  onSelectPlaceForNav,
  onViewVenueDetail,
  onShowToast,
  onAddPoints,
  onGoToSuggest,
  spots,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('step-free');
  const [selectedSpotId, setSelectedSpotId] = useState<string>('cafe');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'contrast'>('standard');
  const [verifiedSpot, setVerifiedSpot] = useState<boolean>(false);

  const currentSpot = spots.find((s) => s.id === selectedSpotId) || spots[0];

  const handleVoiceSearch = () => {
    setIsListening(true);
    onShowToast('Listening for accessible destination...', 'mic');
    setTimeout(() => {
      setSearchQuery('Café Blue Horizon, Waterfront');
      setIsListening(false);
      setSelectedSpotId('cafe');
      onShowToast('Location found: Café Blue Horizon', 'search_check');
    }, 1800);
  };

  const handleVerifyPrompt = () => {
    if (verifiedSpot) {
      onShowToast('Already confirmed accurate for today!', 'check_circle');
      return;
    }
    setVerifiedSpot(true);
    onAddPoints(10);
    onShowToast('Spot verified accurate! +10 Access Points earned.', 'verified');
  };

  const handleShareSpot = () => {
    if (navigator.share) {
      navigator.share({
        title: currentSpot.name,
        text: `Check out the accessibility verification for ${currentSpot.name}: ${currentSpot.confidenceScore}% verified.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      onShowToast('Accessible link copied to clipboard!', 'share');
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-28 pt-20 px-4 max-w-xl mx-auto">
      {/* 1. Interactive Top Search Module */}
      <section aria-label="Search destination" className="flex flex-col gap-1">
        <div className="relative flex items-center w-full min-h-[56px] rounded-xl bg-white shadow-sm border border-[#cfdaf2]">
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
            placeholder="Where do you want to go?"
            aria-label="Search destination or address"
            className="w-full h-full min-h-[56px] pl-11 pr-24 rounded-xl bg-transparent text-[15px] font-medium text-[#111c2d] placeholder:text-[#707881] focus:outline-none"
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
        </div>
      </section>

      {/* 2. Travel Companion Mode Banner */}
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
            ? 'Showing independently accessible places verified with step-free entrances, power-assist doors, and level turns.'
            : 'Assisted mode active: permits inclines up to 8% with assistant support and companion restroom transfers.'}
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

      {/* 3. Quick Action Accessibility Radar Categories */}
      <section aria-label="Quick Category Filters" className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[15px] text-[#111c2d]">Radar Filters Nearby</h2>
          <span className="text-[12px] text-[#3f4850] font-semibold">84 Accessible Spots</span>
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
              setSelectedSpotId('parking');
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
                selectedFilter === 'parking'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#cce5ff] text-[#001d31]'
              }`}
            >
              24
            </span>
          </button>

          {/* Washrooms */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'washrooms'}
            onClick={() => {
              setSelectedFilter('washrooms');
              setSelectedSpotId('cafe');
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
                selectedFilter === 'washrooms'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#82f5c1] text-[#002114]'
              }`}
            >
              12
            </span>
          </button>

          {/* Step-Free Places */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'step-free'}
            onClick={() => {
              setSelectedFilter('step-free');
              setSelectedSpotId('cafe');
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
                selectedFilter === 'step-free'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#cce5ff] text-[#001d31]'
              }`}
            >
              48
            </span>
          </button>

          {/* Verified Routes */}
          <button
            type="button"
            aria-pressed={selectedFilter === 'routes'}
            onClick={() => {
              setSelectedFilter('routes');
              setSelectedSpotId('library');
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
                selectedFilter === 'routes'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#ffdcc3] text-[#2f1500]'
              }`}
            >
              9
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

      {/* 4. Interactive Map Canvas / Live Radar View */}
      <section
        aria-label="Interactive map representation"
        className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-md border border-[#cfdaf2]"
      >
        {/* Map Base Layer */}
        <div
          className={`w-full h-full bg-cover bg-center transition-all duration-300 ${
            activeLayer === 'contrast' ? 'filter contrast-125 saturate-150' : ''
          }`}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsyNS_aNaDOQPdbvk7U9TGB6pZmmOKv97VUC59iqZsT66NvZH3LYPCF93Oq44W9qqEDSrbeVz0fsmGcfmwb3l4Ybb7xK5uafyYzJ4yNgqQqbIdBa6puj4wGLwQtHf7wlL9Qj34lWK2-ToMrOCnFOc0u4tpCYFbjFZ5lsDTH1ItL_vYeEfQot8IV3dQppW4D6CyeW-8K0KBJiwpXVMugeCAcXHW20vGwLYelgxyCk9Eioi77z30xDC-aA')",
            transform: `scale(${mapZoom})`,
            transformOrigin: 'center center',
          }}
        />

        {/* Map Legend Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#cfdaf2] flex items-center gap-2">
            <span aria-hidden="true" className="flex h-2.5 w-2.5 rounded-full bg-[#006c4a] animate-pulse" />
            <span className="font-bold text-[12px] text-[#111c2d]">Radar Active • GPS Locked</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMapZoom(1);
              setSelectedSpotId('cafe');
              onShowToast('GPS locked to current position (482 Waterfront Blvd)', 'my_location');
            }}
            aria-label="Recenter map to current location"
            className="pointer-events-auto min-w-[44px] min-h-[44px] rounded-full bg-white text-[#006194] shadow-md flex items-center justify-center border border-[#cfdaf2] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">my_location</span>
          </button>
        </div>

        {/* High-Contrast Interactive Markers */}
        {/* Marker 1: Café Blue Horizon */}
        <button
          type="button"
          id="pin-cafe"
          onClick={() => setSelectedSpotId('cafe')}
          aria-label="Café Blue Horizon: 100% Step-free verified."
          className="absolute top-[32%] left-[49%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] shadow-md transition-all ${
              selectedSpotId === 'cafe'
                ? 'bg-[#006c4a] text-white ring-2 ring-white scale-105'
                : 'bg-white text-[#006c4a] border border-[#006c4a]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            <span>Café Blue Horizon</span>
          </div>
          <div
            className={`w-8 h-8 rounded-full bg-[#006c4a] text-white shadow-lg flex items-center justify-center mt-1 transform transition-all ring-4 ${
              selectedSpotId === 'cafe' ? 'ring-[#82f5c1] scale-110' : 'ring-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">local_cafe</span>
          </div>
          <div className="w-2 h-2 rotate-45 bg-[#006c4a] -mt-1" />
        </button>

        {/* Marker 2: Parking */}
        <button
          type="button"
          onClick={() => setSelectedSpotId('parking')}
          aria-label="City Hall Garage: Accessible parking space available."
          className="absolute top-[28%] right-[16%] flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div
            className={`w-8 h-8 rounded-full bg-[#006194] text-white shadow-lg flex items-center justify-center transform transition-all ring-2 ${
              selectedSpotId === 'parking' ? 'ring-[#93ccff] scale-110' : 'ring-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">local_parking</span>
          </div>
          <span className="mt-0.5 px-1.5 py-0.2 rounded bg-white font-bold text-[11px] text-[#006194] shadow border border-[#cfdaf2]">
            4 Bays
          </span>
        </button>

        {/* Marker 3: Central Public Library (Amber 7° Ramp) */}
        <button
          type="button"
          onClick={() => setSelectedSpotId('library')}
          aria-label="Central Public Library: Ramp available, PA push recommended."
          className="absolute bottom-[22%] left-[16%] flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div
            className={`w-8 h-8 rounded-full bg-[#b15f00] text-white shadow-lg flex items-center justify-center transform transition-all ring-2 ${
              selectedSpotId === 'library' ? 'ring-[#ffdcc3] scale-110' : 'ring-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">accessible</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#ffdcc3] text-[#2f1500] font-bold text-[11px] mt-0.5 shadow">
            <span className="material-symbols-outlined text-[12px]">warning</span>
            <span>7° Ramp</span>
          </div>
        </button>

        {/* Marker 4: Granville Station (Red Hazard) */}
        <button
          type="button"
          onClick={() => setSelectedSpotId('hazard')}
          aria-label="Granville Station: Elevator broken, reported 20 minutes ago."
          className="absolute top-[52%] left-[12%] flex flex-col items-center group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#ba1a1a] text-white shadow-lg flex items-center justify-center animate-bounce">
            <span className="material-symbols-outlined text-[19px]">report</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-bold text-[11px] shadow mt-0.5 border border-[#ba1a1a]/30">
            Out of Order
          </span>
        </button>

        {/* Live Map Layer & Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveLayer(activeLayer === 'standard' ? 'contrast' : 'standard');
              onShowToast(
                activeLayer === 'standard'
                  ? 'High-Contrast Terrain filter enabled'
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

      {/* 5. Barrier Alert Notification Strip */}
      <div
        role="alert"
        className="flex items-start gap-3 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] shadow-sm border border-[#ba1a1a]/30"
      >
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[#ba1a1a] text-[24px] shrink-0 mt-0.5"
        >
          report
        </span>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 font-bold text-[13px]">
            <span>Granville Transit Elevator Out</span>
            <span className="text-[11px] font-normal opacity-85">• 20m ago</span>
          </div>
          <p className="text-[12px] leading-snug mt-0.5">
            Avoid West exit concourse. North ramp detour has active crossing escort.
          </p>
        </div>
      </div>

      {/* 6. Bottom Drawer Preview Card of Selected Place */}
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
            <h3 className="text-[20px] font-bold text-[#111c2d] truncate mt-1">
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
            <span>Start Accessible Route</span>
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

      {/* 7. Community Micro-Prompt */}
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

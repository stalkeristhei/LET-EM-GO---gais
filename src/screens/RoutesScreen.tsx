import React, { useState } from 'react';
import { CompanionMode, GoaRegion } from '../types';
import { GOA_REGIONS } from '../data/mockData';

interface RoutesScreenProps {
  companionMode: CompanionMode;
  currentRegion: GoaRegion;
  onChangeRegion: (region: GoaRegion) => void;
  onToggleCompanionMode: (mode: CompanionMode) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onAddPoints: (points: number) => void;
  initialSubView?: 'venue-detail' | 'live-nav';
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({
  companionMode,
  currentRegion,
  onChangeRegion,
  onToggleCompanionMode,
  onShowToast,
  onAddPoints,
  initialSubView = 'venue-detail',
}) => {
  const [subView, setSubView] = useState<'venue-detail' | 'live-nav'>(initialSubView);
  const [selectedRoute, setSelectedRoute] = useState<'A' | 'B'>('A');
  const [voiceCues, setVoiceCues] = useState(true);
  const [hapticPulses, setHapticPulses] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStepIndex, setNavStepIndex] = useState(0);
  const [hasVerifiedVenue, setHasVerifiedVenue] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  // Route specs per region
  const routeConfigs = {
    panjim: {
      origin: 'Hotel Miramar / DB Marg',
      originDetail: 'Ground level entrance • Automatic sliding doors',
      destination: 'Krishnadas Shama Goa State Central Library',
      destinationDetail: 'Patto Plaza East Portico (Audio beacon enabled)',
      routeA: {
        name: 'Route A: Miramar Waterfront Way',
        time: '18 min',
        dist: '1.2 km roll',
        confidence: 98,
        incline: 'Max 2.8% grade',
        scouts: '34 community scouts confirmed clear today',
      },
      routeB: {
        name: 'Route B: Altinho Hill Shortcut',
        time: '12 min',
        dist: '0.9 km (Shorter)',
        confidence: 71,
        warning: 'Altinho hill ramp features an 8.5% incline over 50m. Portuguese cobbles near Fontainhas.',
      },
      elevationSvgWaypoints: { start: 'Miramar', mid: 'Campal Bench', goal: 'Library' },
      sensorAlert: {
        title: 'Drainage repair on 31st January Road (Fontainhas)',
        details: 'Temporary solid wooden ramp installed with safe 6% slope. Wide enough for powerchairs (1.1m clearance). Verified solid surface.',
        time: 'Reported 12m ago',
      },
      steps: [
        {
          instruction: 'Exit Hotel Miramar through ground level power-assist doors.',
          distance: 'Start',
          bearing: 'Facing East',
          incline: '0% level asphalt',
          icon: 'door_front',
        },
        {
          instruction: 'Head East on DB Marg waterfront promenade. Tactile guide path on right.',
          distance: '350m',
          bearing: 'Straight',
          incline: '1.2% gentle grade',
          icon: 'straight',
        },
        {
          instruction: 'Cross Campal junction at audible beacon crossing. Wait for chirp tone.',
          distance: '250m',
          bearing: 'Crosswalk',
          incline: 'Flush curb ramp',
          icon: 'hearing',
        },
        {
          instruction: 'Mid-route shaded rest bench area on right side under rain tree canopy.',
          distance: '600m mark',
          bearing: 'Rest Stop',
          incline: '0% flat plaza',
          icon: 'chair',
        },
        {
          instruction: 'Turn slightly right onto Patto Plaza. Enter Central Library Accessible Portico.',
          distance: 'Arriving in 100m',
          bearing: 'Right turn',
          incline: 'Max 2.5% slope',
          icon: 'turn_right',
        },
      ],
      venue: {
        title: 'Krishnadas Shama Goa State Central Library & Cultural Center',
        category: 'Civic & Cultural Hub',
        address: 'Patto Plaza, Panjim, Goa • 0.3 mi away',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R9hmbHgEEpIUyR5L46q82ReuZXf-aw7dXZ7Ik-TvLqXohJKidjd9LBfQvUGC1jKWziwBLFBiVsLDEM7FYypaLrfMW5jNy7N9nglumSeRVyEeQrMVnN7RXF4lpieiqHRK0uxgkP7YG5snzt-9Yb78mpuyrWBd0n2lIsLOLwZr3qgRfLhU_kArfS38QmXydz77xa7qNT43o5jwujTBLJ9QqsfOjAF2fUmH_NMvzf04HuJhU3D8F5un6w',
        points: 42,
        confidence: 96,
        entranceSolo: 'Step-free auto doors (110cm wide), flat threshold',
        entrancePa: 'Easy level roll-in, zero queue bottleneck',
        transportSolo: '2 elevators with tactile braille & chime annunciation',
        transportPa: 'High capacity (1800kg), ample 360° turn space',
        restroomsSolo: 'Grab bars, motion taps, floor-reaching alarm pull',
        restroomsPa: 'Full clearance for companion transfer assist',
        parkingSolo: '4 designated van-accessible spots near level ramp',
        parkingPa: 'Sheltered curbside PA drop-off zone with zero curb',
        staffSolo: 'Lowered reception counter right inside entrance',
        staffPa: 'Trained escort support & high-shelf retrieval help',
      },
    },

    porvorim: {
      origin: 'Mall De Goa Main Portico (NH66)',
      originDetail: 'Level entrance • Twin sensor sliding doors (120cm wide)',
      destination: 'Goa State Legislative Assembly Complex',
      destinationDetail: 'Alto-Betim Public Gallery Gate (Tactile walkway)',
      routeA: {
        name: 'Route A: Assembly Boulevard Service Walk',
        time: '14 min',
        dist: '1.1 km roll',
        confidence: 97,
        incline: 'Max 3.0% grade',
        scouts: '29 community scouts confirmed clear today',
      },
      routeB: {
        name: 'Route B: CHOGM Road Cross-Cut',
        time: '10 min',
        dist: '0.7 km (Shorter)',
        confidence: 68,
        warning: 'CHOGM junction highway construction. Missing curb ramp on West service lane.',
      },
      elevationSvgWaypoints: { start: 'Mall De Goa', mid: 'Shaded Kiosk', goal: 'Assembly' },
      sensorAlert: {
        title: 'Highway expansion work near CHOGM Road Junction',
        details: 'Pedestrian signal crossing with audio chimes active 80m South near Holy Family Church.',
        time: 'Reported 18m ago',
      },
      steps: [
        {
          instruction: 'Exit Mall De Goa through step-free main sliding glass portico.',
          distance: 'Start',
          bearing: 'Facing North',
          incline: '0% level stone',
          icon: 'door_front',
        },
        {
          instruction: 'Proceed along NH66 segregated service sidewalk with yellow tactile pavers.',
          distance: '300m',
          bearing: 'Straight',
          incline: '1.5% gentle grade',
          icon: 'straight',
        },
        {
          instruction: 'Cross Holy Family pedestrian crossing with acoustic locator signal.',
          distance: '200m',
          bearing: 'Crosswalk',
          incline: 'Level curb cut',
          icon: 'hearing',
        },
        {
          instruction: 'Rest pavilion at Alto-Betim viewpoint with companion benches.',
          distance: '550m mark',
          bearing: 'Rest Stop',
          incline: '0% paved area',
          icon: 'chair',
        },
        {
          instruction: 'Enter Goa Assembly complex via wide low-gradient switchback ramp.',
          distance: 'Arriving in 80m',
          bearing: 'Left ramp',
          incline: 'Max 2.8% slope',
          icon: 'turn_right',
        },
      ],
      venue: {
        title: 'Mall De Goa & INOX Accessible Multiplex',
        category: 'Shopping & Leisure Complex',
        address: 'NH66, Porvorim, Goa • 0.1 mi away',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R9hmbHgEEpIUyR5L46q82ReuZXf-aw7dXZ7Ik-TvLqXohJKidjd9LBfQvUGC1jKWziwBLFBiVsLDEM7FYypaLrfMW5jNy7N9nglumSeRVyEeQrMVnN7RXF4lpieiqHRK0uxgkP7YG5snzt-9Yb78mpuyrWBd0n2lIsLOLwZr3qgRfLhU_kArfS38QmXydz77xa7qNT43o5jwujTBLJ9QqsfOjAF2fUmH_NMvzf04HuJhU3D8F5un6w',
        points: 39,
        confidence: 97,
        entranceSolo: 'Automatic sliding double doors (120cm wide), zero threshold',
        entrancePa: 'Sheltered curbside PA transfer portico with tactile flooring',
        transportSolo: '4 high-speed elevators with braille & audio floor annunciator',
        transportPa: '1600kg elevator capacity with dual companion control panels',
        restroomsSolo: 'Dedicated roll-in companion restrooms on every level with alarm cord',
        restroomsPa: 'Emergency call button connected directly to mall security control',
        parkingSolo: '8 designated van-accessible spots directly facing entrance',
        parkingPa: 'Valet escort assistance provided for visitors with powerchairs',
        staffSolo: 'Information desk with complimentary wheelchair loan service',
        staffPa: 'Trained escort staff available to assist with cinema seating',
      },
    },

    mapusa: {
      origin: 'Mapusa KTC Bus Stand Concourse',
      originDetail: 'Level concourse access • Portable aluminum ramp on request',
      destination: 'Shree Bodgeshwar Temple Complex',
      destinationDetail: 'Bypass Gate (Marble parikrama & audio chimes)',
      routeA: {
        name: 'Route A: Temple Bypass Accessible Walk',
        time: '16 min',
        dist: '1.3 km roll',
        confidence: 94,
        incline: 'Max 2.2% grade',
        scouts: '26 community scouts confirmed clear today',
      },
      routeB: {
        name: 'Route B: Morod Central Bazaar Lane',
        time: '11 min',
        dist: '0.8 km (Shorter)',
        confidence: 65,
        warning: 'Narrow 70cm sidewalk with vendors. Companion push recommended.',
      },
      elevationSvgWaypoints: { start: 'Bus Stand', mid: 'Market Pergola', goal: 'Temple' },
      sensorAlert: {
        title: 'Platform 4 curb ramp service at Mapusa KTC',
        details: 'KTC ground staff will deploy aluminum ramp on request at enquiry counter for all incoming express buses.',
        time: 'Reported 35m ago',
      },
      steps: [
        {
          instruction: 'Exit Mapusa KTC Bus Stand concourse via ramped North pedestrian exit.',
          distance: 'Start',
          bearing: 'Facing North',
          incline: '0% level concrete',
          icon: 'door_front',
        },
        {
          instruction: 'Head North along Market bypass sidewalk. Continuous smooth paving.',
          distance: '400m',
          bearing: 'Straight',
          incline: '1.0% grade',
          icon: 'straight',
        },
        {
          instruction: 'Cross Calangute bypass at audible beacon signal. Flush curb cut.',
          distance: '250m',
          bearing: 'Crosswalk',
          incline: 'Zero step',
          icon: 'hearing',
        },
        {
          instruction: 'Shaded rest pergola near Bodgeshwar green precinct with water point.',
          distance: '650m mark',
          bearing: 'Rest Stop',
          incline: '0% flat',
          icon: 'chair',
        },
        {
          instruction: 'Arrive at Shree Bodgeshwar Temple. Enter via smooth stainless steel ramp.',
          distance: 'Arriving in 100m',
          bearing: 'Right ramp',
          incline: 'Max 2.0% slope',
          icon: 'turn_right',
        },
      ],
      venue: {
        title: 'Shree Bodgeshwar Temple & Cultural Plaza',
        category: 'Heritage & Spiritual Centre',
        address: 'Bypass Road, Mapusa, Goa • 0.2 mi away',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R9hmbHgEEpIUyR5L46q82ReuZXf-aw7dXZ7Ik-TvLqXohJKidjd9LBfQvUGC1jKWziwBLFBiVsLDEM7FYypaLrfMW5jNy7N9nglumSeRVyEeQrMVnN7RXF4lpieiqHRK0uxgkP7YG5snzt-9Yb78mpuyrWBd0n2lIsLOLwZr3qgRfLhU_kArfS38QmXydz77xa7qNT43o5jwujTBLJ9QqsfOjAF2fUmH_NMvzf04HuJhU3D8F5un6w',
        points: 27,
        confidence: 94,
        entranceSolo: 'Continuous smooth polished marble parikrama, step-free access',
        entrancePa: 'Wide side gate with sheltered companion drop-off bay',
        transportSolo: 'Ground-level prayer hall with non-slip tactile guide paths',
        transportPa: 'Companion seating zone with unobstructed view of sanctum',
        restroomsSolo: 'Renovated roll-in unisex restroom with grab bars',
        restroomsPa: 'Emergency alarm cord monitored by temple office',
        parkingSolo: '6 dedicated van parking spots near West entrance gate',
        parkingPa: 'Level paved pathway directly connecting parking to shrine',
        staffSolo: 'Temple volunteer team assisting visitors with mobility needs',
        staffPa: 'Audio bells and chimes positioned at accessible seated heights',
      },
    },
  };

  const activeRouteData = routeConfigs[currentRegion] || routeConfigs.panjim;
  const currentVenue = activeRouteData.venue;
  const navigationSteps = activeRouteData.steps;

  const handleVerifyInfo = () => {
    if (hasVerifiedVenue) {
      onShowToast('Spot already validated today!', 'check_circle');
      return;
    }
    setHasVerifiedVenue(true);
    onAddPoints(10);
    onShowToast(`Confirmed accurate for ${currentVenue.title}! +10 AP earned.`, 'verified');
  };

  const handleReportBarrier = () => {
    setReportModalOpen(true);
  };

  const handleSubmitBarrier = () => {
    if (!reportText.trim()) {
      onShowToast('Please specify barrier details', 'warning');
      return;
    }
    setReportModalOpen(false);
    setReportText('');
    onAddPoints(20);
    onShowToast('Incident report saved (+20 AP pending peer verification).', 'flag');
  };

  const handleStartLiveNavigation = () => {
    setSubView('live-nav');
    setIsNavigating(true);
    setNavStepIndex(0);
    onShowToast(`Accessible turn-by-turn routing started in ${currentRegion.toUpperCase()}! 📍`, 'navigation');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 px-4 max-w-xl mx-auto space-y-4">
      {/* 1. Goa Region Selector Bar */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#e7eeff] rounded-2xl border border-[#cfdaf2]">
        {GOA_REGIONS.map((reg) => {
          const isActive = currentRegion === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              onClick={() => {
                onChangeRegion(reg.id);
                setIsNavigating(false);
                setNavStepIndex(0);
                onShowToast(`Switched route routes to ${reg.name}`, 'explore');
              }}
              className={`py-1.5 px-1 rounded-xl font-bold text-[12px] flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'text-[#3f4850] hover:text-[#111c2d] hover:bg-white/60'
              }`}
            >
              <span>{reg.id === 'panjim' ? '🌴 Panjim' : reg.id === 'porvorim' ? '🏛️ Porvorim' : '🛍️ Mapusa'}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Top Segmented Sub-View Switcher */}
      <div className="bg-[#e7eeff] p-1 rounded-xl flex items-center justify-between shadow-xs border border-[#cfdaf2]">
        <button
          type="button"
          onClick={() => {
            setSubView('venue-detail');
            setIsNavigating(false);
          }}
          className={`flex-1 min-h-[40px] py-1.5 px-3 rounded-lg font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all ${
            subView === 'venue-detail'
              ? 'bg-[#006194] text-white shadow-xs'
              : 'text-[#3f4850] hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">domain</span>
          <span>Venue Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setSubView('live-nav')}
          className={`flex-1 min-h-[40px] py-1.5 px-3 rounded-lg font-bold text-[13px] flex items-center justify-center gap-1.5 transition-all ${
            subView === 'live-nav'
              ? 'bg-[#006194] text-white shadow-xs'
              : 'text-[#3f4850] hover:text-[#111c2d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">alt_route</span>
          <span>Live Route Planner</span>
        </button>
      </div>

      {/* =========================================
          SUB-VIEW 1: VENUE ACCESS MATRIX (HTML 1 / Image 3)
         ========================================= */}
      {subView === 'venue-detail' && (
        <div className="flex flex-col w-full space-y-4">
          {/* Place Overview Hero Tile */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-[#cfdaf2]">
            <div className="relative h-44 w-full">
              <img
                src={currentVenue.image}
                alt={`${currentVenue.title} entrance`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263143]/90 via-[#263143]/40 to-transparent" />

              {/* Live Badge on Hero */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#82f5c1] text-[#00714e] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse" />
                <span className="font-bold text-[11px]">Updated 2h ago</span>
              </div>

              {/* Quick Place Tag */}
              <div className="absolute bottom-2.5 left-4 right-4 flex flex-col text-white">
                <div className="flex items-center gap-1.5 text-[#93ccff] font-bold text-[11px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">local_library</span>
                  <span>{currentVenue.category}</span>
                </div>
                <h1 className="text-[20px] font-bold text-white leading-tight">
                  {currentVenue.title}
                </h1>
                <p className="text-[12px] text-[#dee8ff] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  <span>{currentVenue.address}</span>
                </p>
              </div>
            </div>

            {/* Verification Confidence Strip */}
            <div className="p-3.5 bg-[#f0f3ff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#82f5c1] flex items-center justify-center text-[#00714e] shadow-xs">
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified_user
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[18px] text-[#006c4a] font-bold">{currentVenue.confidence}%</span>
                      <span className="text-[13px] font-bold text-[#111c2d]">Verified Accessible</span>
                    </div>
                    <p className="text-[12px] text-[#3f4850]">
                      Validated by {currentVenue.points} trusted Goa community navigators
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px]">
                  High Trust
                </span>
              </div>

              {/* Structural Progress Track */}
              <div className="w-full bg-[#e7eeff] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#006c4a] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${currentVenue.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Perspective Mode Explanation Callout */}
          <div className="bg-[#006194]/10 rounded-2xl p-3.5 flex items-start gap-2.5 shadow-xs border border-[#006194]/20">
            <div className="p-2 rounded-xl bg-[#006194] text-white shrink-0">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[13px] text-[#006194] block">
                Tailored Realities Comparison ({currentRegion.toUpperCase()})
              </span>
              <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                Toggle companion mode above or review side-by-side to understand independence thresholds versus accompanied ease.
              </p>
            </div>
          </div>

          {/* Solo vs PA Comparison Matrix */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#cfdaf2] flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[22px]">table_chart</span>
                <h2 className="text-[17px] font-bold text-[#111c2d]">Access Comparison Matrix</h2>
              </div>
              <span className="text-[11px] font-bold text-[#3f4850] bg-[#e7eeff] px-2 py-0.5 rounded-full border border-[#cfdaf2]">
                5 Critical Points
              </span>
            </div>

            {/* Matrix Stack */}
            <div className="space-y-2.5">
              {/* Row 1: Entrance */}
              <div className="rounded-xl bg-[#f0f3ff] p-2.5 space-y-1.5 border border-[#cfdaf2]/60">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">sensor_door</span>
                    <span className="font-bold text-[13px] text-[#111c2d]">1. Entrance</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Grade A
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006194]">person</span> Solo
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.entranceSolo}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006c4a]">group</span> With PA
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.entrancePa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2: Vertical Transport */}
              <div className="rounded-xl bg-[#f0f3ff] p-2.5 space-y-1.5 border border-[#cfdaf2]/60">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">elevator</span>
                    <span className="font-bold text-[13px] text-[#111c2d]">2. Vertical Transport</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Certified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006194]">person</span> Solo
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.transportSolo}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006c4a]">group</span> With PA
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.transportPa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Restrooms */}
              <div className="rounded-xl bg-[#f0f3ff] p-2.5 space-y-1.5 border border-[#cfdaf2]/60">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">wc</span>
                    <span className="font-bold text-[13px] text-[#111c2d]">3. Restrooms</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Cord Monitored
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006194]">person</span> Solo
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.restroomsSolo}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006c4a]">group</span> With PA
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.restroomsPa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 4: Parking & Transit */}
              <div className="rounded-xl bg-[#f0f3ff] p-2.5 space-y-1.5 border border-[#cfdaf2]/60">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">local_parking</span>
                    <span className="font-bold text-[13px] text-[#111c2d]">4. Parking & Transit</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#82f5c1] text-[#00714e] font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span> Direct Access
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006194]">person</span> Solo
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.parkingSolo}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006c4a]">group</span> With PA
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.parkingPa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 5: Staff Support */}
              <div className="rounded-xl bg-[#f0f3ff] p-2.5 space-y-1.5 border border-[#cfdaf2]/60">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006194] text-[18px]">support_agent</span>
                    <span className="font-bold text-[13px] text-[#111c2d]">5. Staff Support</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dee8ff] text-[#006194] font-bold text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">info</span> Staffed Desk
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006194]">person</span> Solo
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.staffSolo}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 flex flex-col shadow-xs border border-[#cfdaf2]">
                    <span className="font-bold text-[11px] text-[#3f4850] flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-[14px] text-[#006c4a]">group</span> With PA
                    </span>
                    <p className="text-[12px] text-[#111c2d] leading-snug">
                      {currentVenue.staffPa}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Human Experience & Dignity Breakdown */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#cfdaf2] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d4b00] text-[24px]">
                  sentiment_satisfied
                </span>
                <h2 className="text-[17px] font-bold text-[#111c2d]">Human Experience & Dignity</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] font-bold text-[11px]">
                4.8 / 5.0 Avg
              </span>
            </div>

            {/* Metric Ratings */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col items-center text-center border border-[#cfdaf2]">
                <div className="flex items-center text-[#8d4b00] gap-0.5 mb-0.5">
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[18px] font-bold text-[#111c2d]">4.9</span>
                </div>
                <span className="text-[11px] font-semibold text-[#3f4850]">Respect & Dignity</span>
              </div>

              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col items-center text-center border border-[#cfdaf2]">
                <div className="flex items-center text-[#8d4b00] gap-0.5 mb-0.5">
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[18px] font-bold text-[#111c2d]">4.7</span>
                </div>
                <span className="text-[11px] font-semibold text-[#3f4850]">Staff Training</span>
              </div>

              <div className="bg-[#f0f3ff] rounded-xl p-2.5 flex flex-col items-center text-center border border-[#cfdaf2]">
                <div className="flex items-center text-[#8d4b00] gap-0.5 mb-0.5">
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[18px] font-bold text-[#111c2d]">4.8</span>
                </div>
                <span className="text-[11px] font-semibold text-[#3f4850]">PA Treatment</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative bg-[#e7eeff] rounded-xl p-3.5 border border-[#cfdaf2]">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006194] text-[26px] shrink-0">
                  format_quote
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-[#111c2d] italic leading-relaxed">
                    “Security guard immediately cleared the accessible turnstile without me having to ask. Elevator buttons are lowered and touch-responsive.”
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-[#006194] font-bold">
                      Marcus T. (Wheelchair Navigator)
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#707881]" />
                    <span className="text-[11px] text-[#707881]">Yesterday in {currentRegion.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Community Contribution Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-md border border-[#cfdaf2] space-y-2.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[16px] font-bold text-[#111c2d]">Community Action</span>
              <span className="text-[12px] text-[#006194] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">stars</span> Earn Points
              </span>
            </div>

            {/* Dual Action Verification Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="verifyBtn"
                onClick={handleVerifyInfo}
                className={`min-h-[48px] px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-colors ${
                  hasVerifiedVenue
                    ? 'bg-[#006c4a] text-white'
                    : 'bg-[#82f5c1] text-[#00714e] hover:bg-[#85f8c4]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[13px] leading-tight">
                    {hasVerifiedVenue ? 'Verified ✓' : 'Verify Info'}
                  </span>
                  <span className="text-[11px] opacity-90">+10 AP</span>
                </div>
              </button>

              <button
                type="button"
                id="reportBtn"
                onClick={handleReportBarrier}
                className="min-h-[48px] px-3 py-2 rounded-xl bg-[#dee8ff] text-[#111c2d] hover:bg-[#cfdaf2] transition-colors active:scale-98 flex items-center justify-center gap-1.5 shadow-sm border border-[#cfdaf2]"
              >
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">report</span>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[13px] leading-tight">Report Barrier</span>
                  <span className="text-[11px] text-[#ba1a1a] font-bold">+20 AP</span>
                </div>
              </button>
            </div>

            {/* Primary Journey Launch */}
            <button
              type="button"
              onClick={handleStartLiveNavigation}
              className="w-full min-h-[52px] mt-1 px-4 py-3 rounded-xl bg-[#006194] text-white hover:bg-[#007bb9] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md font-bold text-[16px]"
            >
              <span className="material-symbols-outlined text-[22px]">navigation</span>
              <span>Start Accessible Navigation in {currentRegion.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          SUB-VIEW 2: LIVE NAVIGATION (HTML 4 / Image 9)
         ========================================= */}
      {subView === 'live-nav' && (
        <div className="flex flex-col w-full space-y-4">
          {/* Active Navigation Guidance HUD if started */}
          {isNavigating && (
            <div className="bg-[#263143] text-white p-4 rounded-2xl shadow-xl border border-[#93ccff]/40 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#82f5c1] animate-ping" />
                  <span className="text-[12px] font-bold tracking-wider text-[#93ccff] uppercase">
                    Live GPS Sidewalk Guidance ({currentRegion.toUpperCase()})
                  </span>
                </div>
                <span className="text-[12px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Step {navStepIndex + 1} of {navigationSteps.length}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#006194] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[28px]">
                    {navigationSteps[navStepIndex].icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-bold leading-snug">
                    {navigationSteps[navStepIndex].instruction}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[12px] text-[#93ccff]">
                    <span>{navigationSteps[navStepIndex].distance}</span>
                    <span>•</span>
                    <span>{navigationSteps[navStepIndex].incline}</span>
                  </div>
                </div>
              </div>

              {/* Progress Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={navStepIndex === 0}
                  onClick={() => setNavStepIndex(Math.max(0, navStepIndex - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-[12px] font-bold"
                >
                  Previous Turn
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (navStepIndex < navigationSteps.length - 1) {
                        setNavStepIndex(navStepIndex + 1);
                        if (hapticPulses && navigator.vibrate) navigator.vibrate([50, 50]);
                      } else {
                        onShowToast(`Arrived at ${activeRouteData.destination}! Safe arrival recorded.`, 'flag');
                        setIsNavigating(false);
                      }
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#006c4a] hover:bg-[#00714e] text-white text-[13px] font-bold shadow-sm"
                  >
                    {navStepIndex < navigationSteps.length - 1 ? 'Next Step ➔' : 'Complete Route 🎉'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode Switcher Pill Control */}
          <section aria-label="Traveler Mode Selection" className="w-full">
            <div className="bg-[#e7eeff] p-1 rounded-full flex items-center justify-between shadow-xs border border-[#cfdaf2]">
              <button
                type="button"
                id="soloModeBtn"
                aria-pressed={companionMode === 'solo'}
                onClick={() => onToggleCompanionMode('solo')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full font-bold text-[13px] transition-all active:scale-95 ${
                  companionMode === 'solo'
                    ? 'bg-[#111c2d] text-white shadow-sm'
                    : 'text-[#3f4850] hover:bg-[#dee8ff]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={companionMode === 'solo' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  person
                </span>
                <span>Solo 🧍</span>
              </button>
              <button
                type="button"
                id="paModeBtn"
                aria-pressed={companionMode === 'pa'}
                onClick={() => onToggleCompanionMode('pa')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full font-bold text-[13px] transition-all active:scale-95 ${
                  companionMode === 'pa'
                    ? 'bg-[#111c2d] text-white shadow-sm'
                    : 'text-[#3f4850] hover:bg-[#dee8ff]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[19px]"
                  style={companionMode === 'pa' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  group
                </span>
                <span>PA Assist 👥</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5 px-2 pt-2 text-[#3f4850] font-bold text-[12px]">
              <span className="material-symbols-outlined text-[16px] text-[#006c4a]">check_circle</span>
              <span id="modeDescription">
                {companionMode === 'solo'
                  ? 'Strictly step-free, max incline ≤ 5%, tactile corridors.'
                  : 'Assisted mode active: permits inclines up to 8% with companion assistance.'}
              </span>
            </div>
          </section>

          {/* Route Waypoints Overview Card */}
          <section className="w-full bg-white p-4 rounded-2xl shadow-sm border border-[#cfdaf2]">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1 self-stretch">
                <span
                  className="material-symbols-outlined text-[#006194] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  trip_origin
                </span>
                <div className="w-0.5 flex-1 bg-[#d8e3fb] my-1 rounded-full min-h-[24px]" />
                <span
                  className="material-symbols-outlined text-[#ba1a1a] text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <div>
                  <span className="text-[11px] font-bold text-[#707881] uppercase tracking-wider block">
                    Origin
                  </span>
                  <p className="text-[16px] font-bold text-[#111c2d]">{activeRouteData.origin}</p>
                  <span className="text-[12px] text-[#006c4a] font-medium flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">accessible</span>
                    {activeRouteData.originDetail}
                  </span>
                </div>
                <div className="pt-1 border-t border-[#cfdaf2]/50">
                  <span className="text-[11px] font-bold text-[#707881] uppercase tracking-wider block">
                    Destination
                  </span>
                  <p className="text-[16px] font-bold text-[#111c2d]">{activeRouteData.destination}</p>
                  <span className="text-[12px] text-[#3f4850] font-medium flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">park</span>
                    {activeRouteData.destinationDetail}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Route Comparison Cards */}
          <section aria-label="Available Routes" className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[17px] font-bold text-[#111c2d]">Recommended Routes ({currentRegion.toUpperCase()})</h2>
              <span className="text-[12px] text-[#006194] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">tune</span> 2 Filtered
              </span>
            </div>

            {/* Route A: Selected & Recommended */}
            <article
              tabIndex={0}
              role="radio"
              aria-checked={selectedRoute === 'A'}
              onClick={() => setSelectedRoute('A')}
              className={`w-full bg-white rounded-2xl p-4 shadow-md cursor-pointer transition-all border ${
                selectedRoute === 'A'
                  ? 'border-[#006194] ring-2 ring-[#006194]/20'
                  : 'border-[#cfdaf2] opacity-85'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-[#82f5c1] text-[#00714e] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    100% Fully Accessible
                  </span>
                  <span className="bg-[#cce5ff] text-[#001d31] font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <span
                  className="material-symbols-outlined text-[#006194] text-[22px]"
                  style={selectedRoute === 'A' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {selectedRoute === 'A' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-[19px] font-bold text-[#111c2d]">{activeRouteData.routeA.name}</h3>
                <div className="text-right">
                  <span className="text-[20px] font-bold text-[#006194]">{activeRouteData.routeA.time}</span>
                  <span className="text-[12px] text-[#707881] block">{activeRouteData.routeA.dist}</span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="bg-[#f0f3ff] p-2.5 rounded-xl mb-3 border border-[#cfdaf2]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#111c2d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#006c4a] text-[16px]">shield</span>
                    Community Confidence Score
                  </span>
                  <span className="text-[13px] text-[#006c4a] font-bold">{activeRouteData.routeA.confidence}% Verified</span>
                </div>
                <div className="w-full h-2 bg-[#d8e3fb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006c4a] rounded-full" style={{ width: `${activeRouteData.routeA.confidence}%` }} />
                </div>
                <p className="text-[12px] text-[#3f4850] mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  {activeRouteData.routeA.scouts}
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#f0f3ff] p-2 rounded-lg flex items-center gap-2 border border-[#cfdaf2]">
                  <span className="material-symbols-outlined text-[#006194] text-[20px]">stairs</span>
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#111c2d] block">Zero Stairs</span>
                    <span className="text-[11px] text-[#707881] truncate block">Tactile paving intact</span>
                  </div>
                </div>
                <div className="bg-[#f0f3ff] p-2 rounded-lg flex items-center gap-2 border border-[#cfdaf2]">
                  <span className="material-symbols-outlined text-[#006194] text-[20px]">
                    close_fullscreen
                  </span>
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#111c2d] block">Gentle Incline</span>
                    <span className="text-[11px] text-[#707881] truncate block">{activeRouteData.routeA.incline}</span>
                  </div>
                </div>
                <div className="bg-[#f0f3ff] p-2 rounded-lg flex items-center gap-2 border border-[#cfdaf2]">
                  <span className="material-symbols-outlined text-[#006194] text-[20px]">volume_up</span>
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#111c2d] block">Audio Signals</span>
                    <span className="text-[11px] text-[#707881] truncate block">Audible crosswalk beacons</span>
                  </div>
                </div>
                <div className="bg-[#f0f3ff] p-2 rounded-lg flex items-center gap-2 border border-[#cfdaf2]">
                  <span className="material-symbols-outlined text-[#006194] text-[20px]">chair</span>
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#111c2d] block">Rest Bench</span>
                    <span className="text-[11px] text-[#707881] truncate block">Halfway shaded rest point</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Route B: PA Warning */}
            <article
              tabIndex={0}
              role="radio"
              aria-checked={selectedRoute === 'B'}
              onClick={() => setSelectedRoute('B')}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition-all border ${
                selectedRoute === 'B'
                  ? 'border-[#b15f00] ring-2 ring-[#b15f00]/20'
                  : 'border-[#cfdaf2] opacity-85'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#ffdcc3] text-[#2f1500] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Accessible with PA Push
                </span>
                <span
                  className="material-symbols-outlined text-[#707881] text-[22px]"
                  style={selectedRoute === 'B' ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {selectedRoute === 'B' ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-[19px] font-bold text-[#111c2d]">{activeRouteData.routeB.name}</h3>
                <div className="text-right">
                  <span className="text-[20px] font-bold text-[#111c2d]">{activeRouteData.routeB.time}</span>
                  <span className="text-[12px] text-[#707881] block">{activeRouteData.routeB.dist}</span>
                </div>
              </div>

              <div className="bg-[#f0f3ff] p-2.5 rounded-xl mb-3 border border-[#cfdaf2]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#111c2d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#8d4b00] text-[16px]">shield</span>
                    Community Confidence Score
                  </span>
                  <span className="text-[13px] text-[#8d4b00] font-bold">{activeRouteData.routeB.confidence}% Conditional</span>
                </div>
                <div className="w-full h-2 bg-[#d8e3fb] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8d4b00] rounded-full" style={{ width: `${activeRouteData.routeB.confidence}%` }} />
                </div>
              </div>

              {/* Friction Warning */}
              <div className="bg-[#ffdad6] p-3 rounded-xl flex items-start gap-2.5 text-[#93000a] border border-[#ba1a1a]/30">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                  report_problem
                </span>
                <div className="text-left text-[12px]">
                  <span className="font-bold block text-[13px]">Solo Navigation Warning</span>
                  {activeRouteData.routeB.warning}
                </div>
              </div>
            </article>
          </section>

          {/* Elevation & Path Profile */}
          <section
            aria-labelledby="elevationHeading"
            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-[#cfdaf2]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006194] text-[20px]">show_chart</span>
                <h3 id="elevationHeading" className="text-[16px] font-bold text-[#111c2d]">
                  Elevation & Path Profile
                </h3>
              </div>
              <span className="bg-[#82f5c1] text-[#00714e] font-bold text-[11px] px-2 py-0.5 rounded-full">
                {activeRouteData.routeA.incline}
              </span>
            </div>

            {/* SVG Profile Chart */}
            <div className="w-full bg-[#f0f3ff] p-3 rounded-xl border border-[#cfdaf2]">
              <svg
                viewBox="0 0 320 90"
                className="w-full h-28"
                fill="none"
                preserveAspectRatio="none"
                aria-label="Elevation visualizer: flat start rising gently to mid-point"
              >
                <line x1="0" y1="20" x2="320" y2="20" stroke="#cfdaf2" strokeDasharray="4" strokeWidth="1" />
                <line x1="0" y1="50" x2="320" y2="50" stroke="#cfdaf2" strokeDasharray="4" strokeWidth="1" />
                <line x1="0" y1="75" x2="320" y2="75" stroke="#cfdaf2" strokeDasharray="4" strokeWidth="1" />
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006194" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006194" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 70 Q 70 68, 120 58 T 210 48 T 270 52 L 320 40 L 320 85 L 0 85 Z" fill="url(#elevationGrad)" />
                <path d="M 0 70 Q 70 68, 120 58 T 210 48 T 270 52 L 320 40" stroke="#006194" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="20" cy="70" r="4.5" fill="#006194" />
                <circle cx="160" cy="52" r="5.5" fill="#82f5c1" stroke="#006c4a" strokeWidth="2.5" />
                <circle cx="300" cy="40" r="4.5" fill="#ba1a1a" />
                <text x="18" y="86" fontSize="9.5" fill="#3f4850" fontWeight="bold">
                  {activeRouteData.elevationSvgWaypoints.start}
                </text>
                <text x="130" y="42" fontSize="9.5" fill="#006c4a" fontWeight="bold">
                  {activeRouteData.elevationSvgWaypoints.mid}
                </text>
                <text x="255" y="32" fontSize="9.5" fill="#ba1a1a" fontWeight="bold">
                  {activeRouteData.elevationSvgWaypoints.goal}
                </text>
              </svg>
              <div className="flex items-center justify-between text-[11px] font-bold text-[#3f4850] pt-2 border-t border-[#cfdaf2]/50">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006194] inline-block" /> 0 km (Start)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#82f5c1] inline-block border border-[#006c4a]" /> 0.6 km (Shaded Bench)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] inline-block" /> 1.2 km (Goal)
                </span>
              </div>
            </div>
          </section>

          {/* Active Sensor Alert */}
          <section aria-live="polite" className="w-full bg-white p-4 rounded-2xl shadow-sm border border-[#cfdaf2]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4b00] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] animate-pulse">radar</span>
                Active Sensor Alert ({currentRegion.toUpperCase()})
              </span>
              <span className="text-[11px] text-[#707881]">{activeRouteData.sensorAlert.time}</span>
            </div>
            <div className="bg-[#ffdcc3] p-3 rounded-xl flex items-start gap-2.5 text-[#2f1500] border border-[#ffb77d]">
              <span
                className="material-symbols-outlined text-[24px] text-[#8d4b00] shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                construction
              </span>
              <div className="flex-1">
                <p className="font-bold text-[14px]">{activeRouteData.sensorAlert.title}</p>
                <p className="text-[12px] text-[#6e3900] mt-0.5 leading-snug">
                  {activeRouteData.sensorAlert.details}
                </p>
              </div>
            </div>
          </section>

          {/* Multi-Sensory Guidance Preferences */}
          <section aria-label="Turn-by-turn Feedback Controls" className="w-full bg-white p-4 rounded-2xl shadow-sm border border-[#cfdaf2]">
            <h3 className="text-[16px] font-bold text-[#111c2d] mb-2.5">Guidance Feedback</h3>
            <div className="flex flex-col gap-2">
              {/* Voice Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors cursor-pointer border border-[#cfdaf2]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#001d31]">
                    <span className="material-symbols-outlined text-[22px]">record_voice_over</span>
                  </div>
                  <div>
                    <span className="font-bold text-[13px] text-[#111c2d] block">Voice Cues</span>
                    <span className="text-[11px] text-[#707881] block">Spatial audio beacons for crosswalks</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={voiceCues}
                  onChange={(e) => setVoiceCues(e.target.checked)}
                  className="w-5 h-5 accent-[#006194] cursor-pointer"
                />
              </label>

              {/* Haptic Pulses Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f3ff] hover:bg-[#e7eeff] transition-colors cursor-pointer border border-[#cfdaf2]">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#85f8c4] flex items-center justify-center text-[#002114]">
                    <span className="material-symbols-outlined text-[22px]">vibration</span>
                  </div>
                  <div>
                    <span className="font-bold text-[13px] text-[#111c2d] block">Haptic Pulses</span>
                    <span className="text-[11px] text-[#707881] block">Distinct rhythm for left vs. right turns</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hapticPulses}
                  onChange={(e) => setHapticPulses(e.target.checked)}
                  className="w-5 h-5 accent-[#006194] cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* Sticky Primary Action Button */}
          <div className="w-full flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              id="startNavBtn"
              onClick={() => {
                setIsNavigating(true);
                setNavStepIndex(0);
                if (hapticPulses && navigator.vibrate) {
                  navigator.vibrate([40, 60, 40]);
                }
                onShowToast(
                  `Routing via ${selectedRoute === 'A' ? activeRouteData.routeA.name : activeRouteData.routeB.name}`,
                  'navigation'
                );
              }}
              className="w-full min-h-[54px] bg-[#006194] text-white rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-md hover:bg-[#007bb9] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">navigation</span>
              <span>
                {isNavigating ? 'Reset Turn-by-Turn' : `Start Accessible Turn-by-Turn in ${currentRegion.toUpperCase()}`}
              </span>
            </button>
            <p className="text-[11px] text-[#707881] font-semibold text-center flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006c4a]">satellite_alt</span>
              High-precision RTK GPS active (30cm sidewalk lock in Goa)
            </p>
          </div>
        </div>
      )}

      {/* Barrier Reporting Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111c2d]/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 border border-[#cfdaf2] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#cfdaf2] pb-2">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[24px]">report</span>
                <h3 className="font-bold text-[16px] text-[#111c2d]">Report Barrier in {currentRegion.toUpperCase()}</h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#e7eeff] flex items-center justify-center text-[#707881]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#3f4850]">
              Specify broken ramps, blocked elevators, or steep unannounced construction obstacles in {currentRegion.toUpperCase()}.
            </p>

            <textarea
              rows={3}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="e.g. Elevators out of service or construction blocking wheelchair ramp..."
              className="w-full p-3 rounded-xl bg-[#f0f3ff] border border-[#cfdaf2] text-[14px] text-[#111c2d] focus:outline-none focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-bold text-[#707881] hover:bg-[#e7eeff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitBarrier}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] text-white text-[13px] font-bold hover:bg-[#93000a] active:scale-95 shadow-sm"
              >
                Submit (+20 AP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

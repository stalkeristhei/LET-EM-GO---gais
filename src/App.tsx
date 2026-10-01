/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { CompanionMode, TabType, LocationSpot, SuggestionItem } from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SPOTS,
  INITIAL_SUGGESTIONS,
  USER_BADGES,
} from './data/mockData';
import { Header } from './components/Header';
import { NavigationTab } from './components/NavigationTab';
import { EmergencySosModal } from './components/EmergencySosModal';
import { FilterModal } from './components/FilterModal';
import { ToastNotification } from './components/ToastNotification';
import { ExploreScreen } from './screens/ExploreScreen';
import { RoutesScreen } from './screens/RoutesScreen';
import { SuggestScreen } from './screens/SuggestScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('explore');
  const [routesSubView, setRoutesSubView] = useState<'venue-detail' | 'live-nav'>('venue-detail');
  const [companionMode, setCompanionMode] = useState<CompanionMode>('solo');
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [spots] = useState<LocationSpot[]>(INITIAL_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<LocationSpot>(INITIAL_SPOTS[0]);
  const [textScale, setTextScale] = useState('100');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(INITIAL_SUGGESTIONS);
  const [badges] = useState(USER_BADGES);

  // Modals & Feedback
  const [sosOpen, setSosOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; icon?: string }>({
    visible: false,
    message: '',
    icon: 'verified',
  });

  const showToast = (message: string, icon = 'verified') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message, icon });
    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 6500);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [textScale]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const focusTarget = currentTab === 'routes' && routesSubView === 'live-nav'
      ? document.querySelector<HTMLElement>('.current-step h2, .arrival-panel h2')
      : document.getElementById('main-content');
    focusTarget?.focus({ preventScroll: true });
    if (currentTab === 'routes' && routesSubView === 'live-nav' && window.matchMedia('(max-width: 699px)').matches) {
      document.querySelector('.step-panel')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [currentTab, routesSubView]);

  const addPoints = (points: number) => {
    setUserProfile((prev) => ({
      ...prev,
      accessPoints: prev.accessPoints + points,
    }));
  };

  const handleToggleCompanionMode = (newMode?: CompanionMode) => {
    const updated = newMode || (companionMode === 'solo' ? 'pa' : 'solo');
    setCompanionMode(updated);
    showToast(
      updated === 'solo'
        ? 'Travelling solo. Mobility access badges updated.'
        : 'Travelling with a companion. Mobility access badges updated.',
      updated === 'solo' ? 'person' : 'group'
    );
  };

  const handleSelectPlaceForNav = (spot: LocationSpot) => {
    setSelectedSpot(spot);
    setCurrentTab('routes');
    setRoutesSubView('live-nav');
    showToast('Route preview opened. These are sample directions, not live navigation.', 'info');
  };

  const handleViewVenueDetail = (spotId: string) => {
    setSelectedSpot(spots.find(spot => spot.id === spotId) || spots[0]);
    setCurrentTab('routes');
    setRoutesSubView('venue-detail');
  };

  const handleAddSuggestion = (newSugg: SuggestionItem) => {
    setSuggestions([newSugg, ...suggestions]);
  };

  const handleUpvoteSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextVoted = !s.userVoted;
          return {
            ...s,
            userVoted: nextVoted,
            votes: nextVoted ? s.votes + 1 : s.votes - 1,
          };
        }
        return s;
      })
    );
  };

  return (
    <div className={`app-shell ${userProfile.highContrast ? 'high-contrast' : ''} ${currentTab === 'routes' && routesSubView === 'live-nav' ? 'route-active' : ''}`}>
      {/* Header */}
      <Header
        currentTab={currentTab}
        subView={currentTab === 'routes' ? routesSubView : undefined}
        companionMode={companionMode}
        onToggleCompanionMode={handleToggleCompanionMode}
        onOpenSos={() => setSosOpen(true)}
        onGoToProfile={() => setCurrentTab('profile')}
        showBack={currentTab === 'routes' && routesSubView === 'live-nav'}
        onBack={() => setRoutesSubView('venue-detail')}
      />

      {/* Main Content Areas */}
      <main id="main-content" tabIndex={-1} className="app-main">
        {currentTab === 'explore' && (
          <ExploreScreen
            companionMode={companionMode}
            onToggleCompanionMode={() => handleToggleCompanionMode()}
            onOpenFilters={() => setFiltersOpen(true)}
            onSelectPlaceForNav={handleSelectPlaceForNav}
            onViewVenueDetail={handleViewVenueDetail}
            onShowToast={showToast}
            onAddPoints={addPoints}
            onGoToSuggest={() => setCurrentTab('suggest')}
            spots={spots}
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
          />
        )}

        {currentTab === 'routes' && (
          <RoutesScreen
            key={selectedSpot.id}
            companionMode={companionMode}
            onToggleCompanionMode={handleToggleCompanionMode}
            onShowToast={showToast}
            onAddPoints={addPoints}
            initialSubView={routesSubView}
            spot={selectedSpot}
            userProfile={userProfile}
            onChangeSubView={setRoutesSubView}
            onOpenSos={() => setSosOpen(true)}
            onGoToExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'suggest' && (
          <SuggestScreen
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
            onUpvoteSuggestion={handleUpvoteSuggestion}
            onShowToast={showToast}
            onAddPoints={addPoints}
          />
        )}

        {currentTab === 'community' && (
          <CommunityScreen
            userProfile={userProfile}
            badges={badges}
            onGoToProfile={() => setCurrentTab('profile')}
            onShowToast={showToast}
            onAddPoints={addPoints}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <NavigationTab
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'routes') {
            setRoutesSubView('venue-detail');
          }
        }}
      />

      {/* Emergency SOS Assistance Modal */}
      <EmergencySosModal
        isOpen={sosOpen}
        onClose={() => setSosOpen(false)}
        userProfile={userProfile}
        onTriggerHelp={(action) => {
          showToast(action, 'sos');
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
        companionMode={companionMode}
        onToggleCompanionMode={handleToggleCompanionMode}
        textScale={textScale}
        onTextScaleChange={setTextScale}
      />

      {/* Global Toast Notification */}
      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        icon={toast.icon}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}

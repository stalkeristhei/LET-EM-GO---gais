/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
    setToast({ visible: true, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3800);
  };

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
        ? 'Solo Mode Active: Filtering for high-autonomy step-free access'
        : 'PA Mode Active: Including companion-supported routes (up to 8° grade)',
      updated === 'solo' ? 'person' : 'group'
    );
  };

  const handleSelectPlaceForNav = (_spot: LocationSpot) => {
    setCurrentTab('routes');
    setRoutesSubView('live-nav');
    showToast(`Accessible turn-by-turn routing initiated!`, 'navigation');
  };

  const handleViewVenueDetail = (_spotId: string) => {
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
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col font-sans selection:bg-[#cce5ff]">
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
      <main className="flex-1 w-full">
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
          />
        )}

        {currentTab === 'routes' && (
          <RoutesScreen
            companionMode={companionMode}
            onToggleCompanionMode={handleToggleCompanionMode}
            onShowToast={showToast}
            onAddPoints={addPoints}
            initialSubView={routesSubView}
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
          showToast(`Emergency Alert Sent: ${action}`, 'sos');
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

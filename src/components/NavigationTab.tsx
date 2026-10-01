import React from 'react';
import { Compass, Route, Lightbulb, UsersRound, UserRound } from 'lucide-react';
import { TabType } from '../types';

interface NavigationTabProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'explore' as const, label: 'Explore', icon: Compass },
    { id: 'routes' as const, label: 'Routes', icon: Route },
    { id: 'suggest' as const, label: 'Suggest', icon: Lightbulb },
    { id: 'community' as const, label: 'Community', icon: UsersRound },
    { id: 'profile' as const, label: 'Profile', icon: UserRound },
  ];
  return <nav className="app-navigation" aria-label="Main navigation"><div className="navigation-inner">
    {tabs.map(({ id, label, icon: Icon }) => <button key={id} aria-current={currentTab === id ? 'page' : undefined} onClick={() => onSelectTab(id)}><Icon size={21} /><span>{label}</span></button>)}
  </div><span className="navigation-note">Access is a right, not a privilege.</span></nav>;
};

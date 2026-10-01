import React from 'react';
import { ArrowLeft, ArrowUpRight, ShieldAlert, UserRound, UsersRound } from 'lucide-react';
import { CompanionMode, TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  subView?: string;
  companionMode: CompanionMode;
  onToggleCompanionMode: (mode: CompanionMode) => void;
  onOpenSos: () => void;
  onGoToProfile: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ companionMode, onToggleCompanionMode, onOpenSos, onGoToProfile, onBack, showBack }) => (
  <header className="app-header">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="header-inner">
      <div className="brand-group">
        {showBack && <button className="icon-button" onClick={onBack} aria-label="Back to place details"><ArrowLeft size={22} /></button>}
        <div className="brand-mark" aria-hidden="true"><ArrowUpRight size={29} strokeWidth={2.5} /></div>
        <div><span className="brand-name">LET ’EM GO<span className="brand-dot">.</span></span><span className="brand-caption">More access. More possibility.</span></div>
      </div>
      <div className="header-actions">
        <div className="travel-toggle" role="group" aria-label="Travel mode">
          <button aria-pressed={companionMode === 'solo'} onClick={() => onToggleCompanionMode('solo')}><UserRound size={16} /><span>Solo</span></button>
          <button aria-pressed={companionMode === 'pa'} onClick={() => onToggleCompanionMode('pa')}><UsersRound size={16} /><span>With companion</span></button>
        </div>
        <button className="sos-button" onClick={onOpenSos}><ShieldAlert size={19} /><span>SOS</span></button>
        <button className="profile-button" onClick={onGoToProfile} aria-label="Open your profile">ER</button>
      </div>
    </div>
  </header>
);

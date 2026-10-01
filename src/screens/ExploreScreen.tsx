import React, { useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, MapPin, Check, CheckCircle2, TriangleAlert, Clock3, ShieldCheck, Accessibility, ChevronRight, RotateCcw, Info, List, Map } from 'lucide-react';
import { CompanionMode, LocationSpot, UserProfileData } from '../types';
import { AccessMap } from '../components/AccessMap';
import { getAccessFit, getPlaceFeatures } from '../utils/accessibility';

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
  userProfile: UserProfileData;
  onUpdateProfile: (updated: Partial<UserProfileData>) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ companionMode, onOpenFilters, onSelectPlaceForNav, onViewVenueDetail, onGoToSuggest, spots, userProfile, onUpdateProfile }) => {
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState('cafe');
  const [search, setSearch] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [needsExpanded, setNeedsExpanded] = useState(false);
  const categories = [{ id: 'all', label: 'All places' }, { id: 'cafe', label: 'Cafés' }, { id: 'parking', label: 'Parking' }, { id: 'library', label: 'Public spaces' }, { id: 'hazard', label: 'Transit' }];
  const results = spots.filter(spot => (category === 'all' || spot.id === category) && `${spot.name} ${spot.category} ${spot.address}`.toLowerCase().includes(search.toLowerCase().trim()));
  const matchedCount = results.filter(spot => getAccessFit(spot, companionMode, userProfile).status === 'match').length;
  const reset = () => { setSearch(''); setCategory('all'); };

  return <div className="discovery-page page-shell">
    <section className="discovery-heading">
      <div><p className="eyebrow"><span className="tiny-dot"/> YOUR CITY, WITH FEWER BARRIERS</p><h1>Go places. <span>On your terms.</span></h1><p>Find places that work for you, before you head out.</p></div>
      <div className="area-label"><MapPin size={18}/><div><strong>Vancouver, BC</strong><span>Waterfront neighbourhood · Demo area</span></div></div>
    </section>
    <div className="discovery-grid">
      <aside className={`needs-panel ${needsExpanded ? 'mobile-expanded' : 'mobile-collapsed'}`} aria-labelledby="needs-title">
        <div className="panel-title"><span className="soft-icon"><Accessibility size={21}/></span><h2 id="needs-title">Your access needs</h2></div>
        <p className="muted">A little about you. A better way to explore.</p>
        <span className="session-label">Applies to this session</span>
        <p className="mobile-needs-summary">{userProfile.stepTolerance.includes('0') ? 'Step-free · ' : ''}{userProfile.maxSlopeTolerance}% grade · {companionMode === 'solo' ? 'Solo' : 'With companion'}</p>
        <button className="mobile-needs-toggle text-button" aria-expanded={needsExpanded} aria-controls="discovery-needs" onClick={() => setNeedsExpanded(!needsExpanded)}>{needsExpanded ? 'Hide needs' : 'Adjust needs'}<SlidersHorizontal size={16}/></button>
        <div className="need-controls" id="discovery-needs">
          <label className="need-option"><input type="checkbox" checked={userProfile.stepTolerance.includes('0')} onChange={event => onUpdateProfile({ stepTolerance: event.target.checked ? 'Strictly 0 steps' : '1-2 steps with handrail' })}/><span><strong>Step-free access</strong><small>No steps at the entrance</small></span></label>
          <label className="need-option"><input type="checkbox" checked={userProfile.audioSignals} onChange={event => onUpdateProfile({ audioSignals: event.target.checked })}/><span><strong>Audible crossings</strong><small>Sound cues along the way</small></span></label>
          <label className="need-option"><input type="checkbox" checked={userProfile.lowSensory} onChange={event => onUpdateProfile({ lowSensory: event.target.checked })}/><span><strong>Quieter spaces</strong><small>Less noise, more breathing room</small></span></label>
        </div>
        <div className="needs-summary"><div><span>Maximum slope</span><strong>{userProfile.maxSlopeTolerance}% grade</strong></div><div><span>Minimum doorway</span><strong>{userProfile.minDoorWidth} cm</strong></div><div><span>Travelling</span><strong>{companionMode === 'solo' ? 'Solo' : 'With companion'}</strong></div></div>
        <button className="button secondary full-width" onClick={onOpenFilters}><SlidersHorizontal size={17}/>Edit access needs</button>
        <p className="needs-footnote"><Info size={15}/><span>Badges compare known mobility details. Sound and sensory information still needs confirmation.</span></p>
        <div className="community-note"><ShieldCheck size={23}/><h3>Better access starts with us.</h3><p>Know a barrier or an improvement? Help make the next trip easier.</p><button className="text-button" onClick={onGoToSuggest}>Share an idea <ArrowRight size={16}/></button></div>
      </aside>
      <section className={`results-panel mobile-${mobileView}`} aria-label="Discover nearby places">
        <label className="search-field"><Search size={21}/><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search a place or address" aria-label="Search a place or address"/></label>
        <div className="category-chips" role="group" aria-label="Place category">{categories.map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
        <div className="results-heading"><div><h2>Places nearby</h2><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'place' : 'places'} · {matchedCount} mobility {matchedCount === 1 ? 'match' : 'matches'}</p></div><span className="results-order">Demo results</span></div>
        <div className="mobile-view-toggle" role="group" aria-label="Discovery view"><button aria-pressed={mobileView === 'list'} onClick={() => setMobileView('list')}><List size={17}/>List</button><button aria-pressed={mobileView === 'map'} onClick={() => setMobileView('map')}><Map size={17}/>Map</button></div>
        <div className="place-list">
          {results.length === 0 && <div className="empty-state"><Search size={32}/><h3>No places found</h3><p>Try another name, address, or category in this demo area.</p><button className="button secondary" onClick={reset}><RotateCcw size={17}/>Clear search & filters</button></div>}
          {results.map(spot => {
            const fit = getAccessFit(spot, companionMode, userProfile);
            return <article className={`place-card ${selectedId === spot.id ? 'is-selected' : ''}`} key={spot.id}>
              <div className="card-status-row"><span className={`status-badge ${fit.status}`}>{fit.status === 'match' ? <CheckCircle2 size={15}/> : <TriangleAlert size={15}/>} {fit.label}</span><span className="distance-label">{spot.distance.replace('away', '')}</span></div>
              <button className="place-title-button" onClick={() => { setSelectedId(spot.id); onViewVenueDetail(spot.id); }}><h3>{spot.name}</h3><ChevronRight size={20}/></button>
              <p className="place-category">{spot.category} <span>·</span> {spot.address}</p>
              <div className="place-features">{getPlaceFeatures(spot).map(feature => <span key={feature}>{fit.status === 'match' ? <Check size={14}/> : <Info size={14}/>} {feature}</span>)}</div>
              {fit.status !== 'match' && <p className="access-caution">{fit.detail}</p>}
              <div className="verification-line"><ShieldCheck size={15}/><span>Sample community report · {spot.lastAudited.replace('Audited', 'updated').replace('Reported', 'reported')}</span></div>
              <div className="card-footer"><span><Clock3 size={15}/>{spot.hours}</span><button className="button primary" disabled={fit.status === 'blocked'} onClick={() => { setSelectedId(spot.id); onSelectPlaceForNav(spot); }}>Preview route <ArrowRight size={17}/></button></div>
              <button className="map-selection-button" onClick={() => { setSelectedId(spot.id); setMobileView('map'); }}><MapPin size={14}/>Show on map</button>
            </article>;
          })}
        </div>
        <div className="data-disclaimer"><Info size={17}/><p>This is a product demo, not verified travel advice. Places, reports, and routes are sample data. Confirm current access with the venue before travelling.</p></div>
      </section>
      <div className={`discovery-map-column mobile-${mobileView}`}><AccessMap spots={results} selectedId={selectedId} onSelect={setSelectedId} fitStatuses={Object.fromEntries(results.map(spot => [spot.id, getAccessFit(spot, companionMode, userProfile).status]))}/><div className="map-caption"><ShieldCheck size={18}/><div><strong>Know more before you go.</strong><p>Access details, reported barriers, and community context — in one place.</p></div></div></div>
    </div>
  </div>;
};

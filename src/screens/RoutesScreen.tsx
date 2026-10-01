import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3, Coffee, Flag, Info, MapPin, Pause, Play, RotateCcw, ShieldCheck, TriangleAlert, Volume2, X } from 'lucide-react';
import { CompanionMode, LocationSpot, UserProfileData } from '../types';
import { AccessMap } from '../components/AccessMap';
import { getAccessFit, getPlaceFeatures } from '../utils/accessibility';
import { useAccessibleDialog } from '../hooks/useAccessibleDialog';

interface RoutesScreenProps {
  companionMode: CompanionMode;
  onToggleCompanionMode: (mode: CompanionMode) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onAddPoints: (points: number) => void;
  initialSubView?: 'venue-detail' | 'live-nav';
  spot: LocationSpot;
  userProfile: UserProfileData;
  onChangeSubView: (view: 'venue-detail' | 'live-nav') => void;
  onOpenSos: () => void;
  onGoToExplore: () => void;
}

export const RoutesScreen: React.FC<RoutesScreenProps> = ({ companionMode, onShowToast, initialSubView = 'venue-detail', spot, userProfile, onChangeSubView, onOpenSos, onGoToExplore }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportError, setReportError] = useState('');
  const closeReport = () => setReportOpen(false);
  const dialogRef = useAccessibleDialog(reportOpen, closeReport);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isRoute = initialSubView === 'live-nav';
  const fit = getAccessFit(spot, companionMode, userProfile);
  const steps = [
    { title: 'Begin at the waterfront', text: 'Start from the sample meeting point on Waterfront Boulevard. Check the pavement and your surroundings before setting off.', icon: MapPin, label: 'Starting point' },
    { title: 'Continue along the pavement', text: 'Follow the illustrated pavement toward the next crossing. Keep to the level section and watch for temporary obstructions.', icon: ArrowRight, label: 'Continue straight' },
    { title: 'Take a moment at the crossing', text: 'Use the marked crossing. Check for traffic and wait for the crossing signal; audible cues are not verified in this demo.', icon: Pause, label: 'Crossing ahead' },
    { title: 'A good place to pause', text: 'The sample route includes a rest stop. Take your time, then continue when you feel ready.', icon: Coffee, label: 'Optional rest stop' },
    { title: `Approach ${spot.name.split(' - ')[0]}`, text: `Look for the entrance at ${spot.address}. ${fit.detail} Confirm the actual entrance and current access with venue staff.`, icon: CheckCircle2, label: 'Destination ahead' },
  ];
  const currentStep = steps[stepIndex];
  const StepIcon = currentStep.icon;
  const voiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = () => {
    if (!voiceSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${currentStep.title}. ${currentStep.text}`);
    utterance.lang = 'en';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isRoute) headingRef.current?.focus();
    if (isRoute && voiceEnabled && !paused && !arrived) speak();
    return () => { if (voiceSupported) window.speechSynthesis.cancel(); };
  }, [stepIndex, isRoute, voiceEnabled, paused, arrived]);

  const startRoute = () => {
    setStepIndex(0); setArrived(false); setPaused(false); setFeedback(null);
    onChangeSubView('live-nav');
  };

  return <div className={`page-shell route-page ${isRoute ? 'navigation-page' : ''}`}>
    <div className="route-breadcrumb"><button className="text-button" onClick={onGoToExplore}><ArrowLeft size={17}/>Explore</button><ChevronRight size={15}/><span>{isRoute ? 'Route preview' : 'Place details'}</span></div>
    {!isRoute ? <>
      <div className="detail-heading"><div><p className="eyebrow">GET TO KNOW YOUR DESTINATION</p><h1>{spot.name}</h1><p><MapPin size={17}/>{spot.address} <span>·</span> {spot.distance}</p></div><span className={`status-badge ${fit.status}`}>{fit.status === 'match' ? <CheckCircle2 size={17}/> : <TriangleAlert size={17}/>} {fit.label}</span></div>
      <div className="detail-grid">
        <div className="detail-main">
          <div className="entrance-illustration" role="img" aria-label="Illustration of a step-free entrance, not a photograph of this venue">
            <svg viewBox="0 0 700 260" aria-hidden="true"><rect width="700" height="260" fill="#e5edf0"/><rect x="105" y="25" width="490" height="216" rx="8" fill="#f9faf7"/><path d="M91 59H609L588 89H112Z" fill="#194b63"/><rect x="127" y="99" width="140" height="128" rx="4" fill="#bed6dc"/><rect x="432" y="99" width="140" height="128" rx="4" fill="#bed6dc"/><rect x="295" y="102" width="110" height="138" rx="4" fill="#416977"/><rect x="308" y="114" width="38" height="113" fill="#b4ced3"/><rect x="354" y="114" width="38" height="113" fill="#b4ced3"/><path d="M105 240H595" stroke="#97adb2" strokeWidth="3"/><path d="M285 239H415L471 260H229Z" fill="#c8d3d0"/><rect x="85" y="175" width="29" height="64" rx="5" fill="#91aba1"/><circle cx="98" cy="160" r="31" fill="#91b59f"/><circle cx="589" cy="160" r="31" fill="#91b59f"/><rect x="576" y="175" width="29" height="64" rx="5" fill="#91aba1"/><text x="350" y="49" textAnchor="middle" fontFamily="sans-serif" fontSize="15" letterSpacing="4" fill="#244452">A LITTLE MORE POSSIBILITY</text></svg>
            <span>Illustrative entrance · not a venue photo</span>
          </div>
          <section className="detail-section"><div className="panel-title"><ShieldCheck size={22}/><h2>Access at a glance</h2></div><p>{fit.detail}</p><div className="detail-features">{getPlaceFeatures(spot).map(feature => <div key={feature}><Check size={18}/>{feature}</div>)}</div><div className="detail-notice"><Info size={18}/><span>Doorway width, slope, and mobility reports inform the match badge. Quiet spaces and audible crossings are not confirmed.</span></div></section>
          <section className="detail-section"><div className="panel-title"><Clock3 size={22}/><h2>Where the information comes from</h2></div><p>Sample community accessibility report. {spot.lastAudited}. These relative dates are illustrative and do not update automatically.</p><div className="trust-stats"><span><strong>{spot.verificationsCount}</strong> sample confirmations</span><span><strong>{spot.staffRating}/5</strong> sample staff rating</span></div><p className="muted">{spot.staffNotes}</p><button className="text-button" onClick={() => setReportOpen(true)}><Flag size={17}/>Report a change</button></section>
        </div>
        <aside className="route-summary"><p className="eyebrow">YOUR NEXT STOP</p><h2>A little planning.<br/>A calmer journey.</h2><p>Preview a focused, step-by-step journey with a rest stop and help always within reach.</p><div className="summary-row"><MapPin size={19}/><span>{spot.distance}</span></div><div className="summary-row"><Clock3 size={19}/><span>{spot.hours}</span></div><div className="summary-row"><ShieldCheck size={19}/><span>{companionMode === 'solo' ? 'Solo travel mode' : 'Travelling with a companion'}</span></div><button className="button primary full-width" disabled={fit.status === 'blocked'} onClick={startRoute}>Preview route <ArrowRight size={18}/></button>{fit.status === 'blocked' && <p className="access-caution">This entrance has a reported disruption. Choose another place.</p>}<p className="needs-footnote"><Info size={15}/>This is a simulated route, not live directions.</p></aside>
      </div>
    </> : <>
      <div className="route-heading"><div><p className="eyebrow">ONE STEP AT A TIME</p><h1>{arrived ? 'You’ve reached the end.' : 'A calmer way to get there.'}</h1><p>Route preview to {spot.name}</p></div><button className="button secondary" onClick={() => onChangeSubView('venue-detail')}>Place details</button></div>
      <div className="route-preview-notice"><Info size={17}/>Demo route only. No GPS tracking or live barrier checks. Do not use these steps as real-world directions.</div>
      <div className="navigation-grid">
        <section className="step-panel" aria-label="Step-by-step route preview">
          {arrived ? <div className="arrival-panel"><span className="arrival-icon"><CheckCircle2 size={42}/></span><h2 ref={headingRef} tabIndex={-1}>Take a breath. You’re here.</h2><p>This completes the demo journey. Was the access information clear?</p><div className="arrival-feedback" role="group" aria-label="Demo feedback"><button className="button secondary" aria-pressed={feedback === 'yes'} onClick={() => setFeedback('yes')}>Yes, it was clear</button><button className="button secondary" aria-pressed={feedback === 'no'} onClick={() => setFeedback('no')}>Needs improvement</button></div><p role="status">{feedback ? 'Thank you. Feedback is shown for this session only; it is not submitted.' : 'Your perspective matters.'}</p><button className="button primary full-width" onClick={onGoToExplore}>Explore more places <ArrowRight size={18}/></button></div> : <>
            <div className="step-topline"><span className="step-label">STEP {stepIndex + 1} OF {steps.length}</span><span>{paused ? 'Paused for a rest' : currentStep.label}</span></div>
            <progress className="route-progress" value={stepIndex + 1} max={steps.length} aria-label="Route preview progress"/>
            <div className="step-symbol"><StepIcon size={35}/></div><div className="current-step" aria-live="polite" aria-atomic="true"><h2 ref={headingRef} tabIndex={-1}>{currentStep.title}</h2><p>{currentStep.text}</p></div>
            <div className="voice-control"><button className="text-button" aria-pressed={voiceEnabled} disabled={!voiceSupported} onClick={() => setVoiceEnabled(!voiceEnabled)}><Volume2 size={18}/>{voiceSupported ? `Voice guidance: ${voiceEnabled ? 'on' : 'off'}` : 'Voice unavailable in this browser'}</button><button className="icon-button" onClick={speak} disabled={!voiceSupported || paused} aria-label="Read this step aloud"><RotateCcw size={18}/></button></div>
            {paused && <p className="rest-message" role="status">Take your time. The next step is here when you’re ready.</p>}
            <div className="step-actions"><button className="button secondary" disabled={stepIndex === 0 || paused} onClick={() => setStepIndex(stepIndex - 1)}><ArrowLeft size={18}/>Back</button><button className="button primary" disabled={paused} onClick={() => { if (stepIndex === steps.length - 1) setArrived(true); else setStepIndex(stepIndex + 1); }}>{stepIndex === steps.length - 1 ? 'Finish preview' : 'Next step'}<ArrowRight size={18}/></button></div>
            <div className="support-actions"><button className="text-button" onClick={() => setPaused(!paused)}>{paused ? <Play size={18}/> : <Pause size={18}/>} {paused ? 'Resume route' : 'I need a rest'}</button><button className="text-button" onClick={() => setReportOpen(true)}><Flag size={17}/>Path blocked</button></div>
          </>}
          <button className="route-help-button" onClick={onOpenSos}><TriangleAlert size={19}/>Need help? Open SOS <ChevronRight size={17}/></button>
        </section>
        <div className="route-map-column"><AccessMap spots={[spot]} selectedId={spot.id} route fitStatuses={{ [spot.id]: fit.status }}/><details className="all-steps"><summary>See all {steps.length} steps</summary><ol>{steps.map((step, index) => <li key={step.title} aria-current={index === stepIndex && !arrived ? 'step' : undefined}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol></details></div>
      </div>
    </>}
    {reportOpen && <div className="dialog-overlay"><div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="report-title" className="dialog-card"><div className="dialog-header"><Flag size={25}/><button className="icon-button" aria-label="Close change report" onClick={closeReport}><X size={21}/></button></div><h2 id="report-title">What has changed?</h2><p>Describe the barrier at {spot.name}. Do not include personal or sensitive information.</p><form onSubmit={event => { event.preventDefault(); if (!reportText.trim()) { setReportError('Describe the change before previewing your report.'); return; } setReportOpen(false); setReportText(''); setReportError(''); onShowToast('Demo report previewed. Nothing has been submitted.', 'info'); }}><label className="form-label" htmlFor="barrier-report">Access change or blocked path</label><textarea id="barrier-report" value={reportText} onChange={event => { setReportText(event.target.value); setReportError(''); }} rows={4} placeholder="For example, the entrance ramp is blocked…" aria-invalid={!!reportError} aria-describedby="report-note report-error"/><p className="form-error" id="report-error" role="alert">{reportError}</p><p id="report-note" className="muted">Demo only. This report is not saved or sent to the venue.</p><button className="button primary full-width" type="submit">Preview report <ArrowRight size={18}/></button></form></div></div>}
  </div>;
};

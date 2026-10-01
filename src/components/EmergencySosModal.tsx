import React from 'react';
import { ShieldAlert, Phone, X, Info } from 'lucide-react';
import { UserProfileData } from '../types';
import { useAccessibleDialog } from '../hooks/useAccessibleDialog';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData;
  onTriggerHelp: (action: string) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useAccessibleDialog(isOpen, onClose);
  if (!isOpen) return null;
  return <div className="dialog-overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="sos-title" aria-describedby="sos-description" className="dialog-card sos-dialog">
      <div className="dialog-header"><span className="sos-symbol"><ShieldAlert size={27}/></span><button className="icon-button" onClick={onClose} aria-label="Close emergency help"><X size={21}/></button></div>
      <p className="eyebrow">HELP WHEN YOU NEED IT</p><h2 id="sos-title">Let’s get you help.</h2><p id="sos-description">If you’re in immediate danger in the US or Canada, call 911. Elsewhere, call your local emergency number.</p>
      <a className="button emergency full-width" href="tel:911"><Phone size={19}/>Call 911</a>
      <div className="data-disclaimer"><Info size={18}/><p>This opens your phone’s dialler. This demo cannot send alerts, contact a companion, or share your location. No help has been dispatched.</p></div>
      <button className="button secondary full-width" onClick={onClose}>Return to the app</button>
    </div>
  </div>;
};

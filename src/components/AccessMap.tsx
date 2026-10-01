import React, { useState } from 'react';
import { ArrowUpRight, Coffee, ParkingCircle, LibraryBig, TriangleAlert, LocateFixed, Minus, Plus, MapPin } from 'lucide-react';
import { LocationSpot } from '../types';

interface AccessMapProps {
  spots: LocationSpot[];
  selectedId: string;
  onSelect?: (id: string) => void;
  route?: boolean;
  fitStatuses?: Record<string, string>;
}

export const AccessMap: React.FC<AccessMapProps> = ({ spots, selectedId, onSelect, route = false, fitStatuses }) => {
  const [zoom, setZoom] = useState(1);
  const selectedSpot = spots.find(spot => spot.id === selectedId);
  const routePath = `M315 445V329H${(selectedSpot?.coords.x ?? 50) * 7}V${(selectedSpot?.coords.y ?? 33) * 6.2}`;
  return <section className={`access-map ${route ? 'route-map' : ''}`} aria-label="Illustrative neighbourhood map">
    <div className="map-topline"><span><MapPin size={14} /> Waterfront neighbourhood</span><span className="map-demo-label">Illustrative map</span></div>
    <div className="map-canvas" style={{ '--map-zoom': zoom } as React.CSSProperties}>
      <div className="map-art">
        <svg viewBox="0 0 700 620" preserveAspectRatio="none" aria-hidden="true">
          <rect width="700" height="620" fill="#edf0eb" />
          <path d="M0 0H700V117L532 163L378 113L209 155L0 85Z" fill="#c9e1ed" />
          <path d="M0 96L207 167L380 125L532 175L700 129" fill="none" stroke="#b2cdd7" strokeWidth="5" />
          <g fill="#d8e6d3"><rect x="418" y="354" width="166" height="131" rx="32"/><rect x="22" y="210" width="104" height="99" rx="20"/><rect x="260" y="504" width="111" height="80" rx="18"/></g>
          <g fill="#e0e3df" stroke="#d3d8d3" strokeWidth="2"><rect x="187" y="212" width="101" height="83" rx="9"/><rect x="338" y="208" width="93" height="83" rx="9"/><rect x="489" y="213" width="90" height="83" rx="9"/><rect x="40" y="365" width="86" height="93" rx="9"/><rect x="188" y="365" width="98" height="92" rx="9"/><rect x="337" y="365" width="58" height="92" rx="9"/><rect x="486" y="519" width="94" height="75" rx="9"/></g>
          <g stroke="#fff" strokeWidth="26" fill="none"><path d="M-30 329H730M-30 483H730M155 156V650M310 150V650M458 174V650M605 141V650"/><path d="M-30 188H730" strokeWidth="19"/></g>
          <g fill="#68776f" fontFamily="sans-serif" fontSize="13" letterSpacing="1"><text x="222" y="335">W GEORGIA ST</text><text x="220" y="489">DUNSMUIR ST</text><text x="328" y="194">WATERFRONT BLVD</text><text x="455" y="414">CITY GARDENS</text><text x="250" y="65" fill="#51788a">VANCOUVER HARBOUR</text><text x="144" y="445" transform="rotate(-90 144 445)">HORNBY ST</text></g>
          {route && <><path d={routePath} stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round"/><path d={routePath} stroke="#006194" strokeWidth="6" fill="none" strokeDasharray="10 8" strokeLinecap="round"/></>}
          <circle cx="315" cy="445" r="26" fill="#006194" opacity=".1"/><circle cx="315" cy="445" r="10" fill="#006194" stroke="white" strokeWidth="4"/>
        </svg>
        {spots.map(spot => {
          const Icon = spot.id === 'parking' ? ParkingCircle : spot.id === 'library' ? LibraryBig : spot.id === 'hazard' ? TriangleAlert : Coffee;
          const status = fitStatuses?.[spot.id] ?? spot.markerType;
          const statusLabel = status === 'match' || status === 'safe' || status === 'parking' ? 'mobility access match' : status === 'blocked' || status === 'hazard' ? 'access disrupted' : 'check access first';
          return <button key={spot.id} className={`map-pin pin-${status} ${selectedId === spot.id ? 'selected' : ''}`} style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }} onClick={() => onSelect?.(spot.id)} aria-label={`${spot.name}, ${statusLabel}${selectedId === spot.id ? ', selected' : ''}`} aria-pressed={selectedId === spot.id} disabled={!onSelect}><Icon size={21} />{selectedId === spot.id && <span>{spot.name.split(' - ')[0].split(' & ')[0]}</span>}</button>;
        })}
      </div>
    </div>
    <div className="map-controls"><button className="icon-button" onClick={() => setZoom(Math.min(1.6, zoom + .2))} disabled={zoom >= 1.6} aria-label="Zoom in"><Plus size={19}/></button><button className="icon-button" onClick={() => setZoom(Math.max(1, zoom - .2))} disabled={zoom <= 1} aria-label="Zoom out"><Minus size={19}/></button><button className="icon-button" onClick={() => setZoom(1)} aria-label="Reset map view"><LocateFixed size={19}/></button></div>
    <div className="map-legend"><span><i className="legend-dot match"/>Access match</span><span><i className="legend-dot caution"/>Check first</span><span><i className="legend-dot blocked"/>Disruption</span></div>
    <div className="map-bottom"><ArrowUpRight size={17}/><span>{route ? 'Illustrative path — follow the text steps in this demo.' : selectedSpot ? `${selectedSpot.distance} · ${selectedSpot.name}` : 'Select a place to see its access details.'}</span></div>
  </section>;
};

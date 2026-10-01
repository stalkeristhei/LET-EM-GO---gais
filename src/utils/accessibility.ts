import { CompanionMode, LocationSpot, UserProfileData } from '../types';

export function getAccessFit(spot: LocationSpot, mode: CompanionMode, profile: UserProfileData) {
  const evaluation = mode === 'solo' ? spot.soloEvaluation : spot.paEvaluation;
  const doorway = spot.soloEvaluation.details.match(/(\d+)cm.*door/);
  const slopeDegrees = spot.soloEvaluation.details.match(/(\d+)°/);
  const slopePercent = slopeDegrees ? Math.tan(Number(slopeDegrees[1]) * Math.PI / 180) * 100 : null;
  if (evaluation.status === 'Barred') return { status: 'blocked', label: 'Access disrupted', detail: evaluation.details };
  if (doorway && Number(doorway[1]) < profile.minDoorWidth) return { status: 'caution', label: 'Doorway below your minimum', detail: `${doorway[1]} cm doorway; your minimum is ${profile.minDoorWidth} cm.` };
  if (slopePercent !== null && slopePercent > profile.maxSlopeTolerance) return { status: 'caution', label: 'Slope above your limit', detail: `The reported ramp is approximately ${slopePercent.toFixed(1)}% grade; your limit is ${profile.maxSlopeTolerance}%.` };
  if (evaluation.status === 'Caution') return { status: 'caution', label: 'Check access first', detail: evaluation.details };
  return { status: 'match', label: 'Mobility access match', detail: evaluation.details };
}

export function getPlaceFeatures(spot: LocationSpot) {
  if (spot.id === 'cafe') return ['Step-free entrance', '90 cm automatic door', 'Roll-in restroom'];
  if (spot.id === 'parking') return ['4 wide parking bays', 'Level lift access', 'Sheltered drop-off'];
  if (spot.id === 'library') return ['7° entrance ramp', 'Wide landings', 'Staff assistance'];
  return ['Lift out of service', 'Alternative entrance', 'Station staff on site'];
}

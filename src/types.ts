export type CompanionMode = 'solo' | 'pa';

export type TabType = 'explore' | 'routes' | 'suggest' | 'community' | 'profile';

export type GoaRegion = 'panjim' | 'porvorim' | 'mapusa';

export interface LocationSpot {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  hours: string;
  confidenceScore: number;
  verificationsCount: number;
  lastAudited: string;
  coords: { x: number; y: number }; // percentage on map
  markerType: 'safe' | 'parking' | 'warning' | 'hazard';
  badgeLabel?: string;
  region: GoaRegion;
  soloEvaluation: {
    status: 'Accessible' | 'Caution' | 'Barred';
    details: string;
  };
  paEvaluation: {
    status: 'Accessible' | 'Caution' | 'Barred';
    details: string;
  };
  staffRating: number;
  staffNotes: string;
}

export interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: 'in_dev' | 'review' | 'evaluating';
  stageLabel: string;
  votes: number;
  commentsCount: number;
  userVoted: boolean;
  progressPercent: number;
  impactNote?: string;
  author?: string;
  timestamp?: string;
  region?: GoaRegion;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
  progressText: string;
  progressPercent: number;
  remainingText?: string;
  badgeType: 'emerald' | 'amber' | 'blue' | 'purple';
}

export interface UserProfileData {
  name: string;
  handle: string;
  avatar: string;
  role: string;
  level: number;
  chapter: string;
  currentRegion: GoaRegion;
  accessPoints: number;
  impactScore: number;
  locationsVerified: number;
  hazardsCleared: number;
  mobilityType: string;
  maxSlopeTolerance: number;
  minDoorWidth: number;
  stepTolerance: string;
  audioSignals: boolean;
  highContrast: boolean;
  tactilePaving: boolean;
  lowSensory: boolean;
  companionName: string;
  companionPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

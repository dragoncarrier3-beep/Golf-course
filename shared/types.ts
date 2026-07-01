import type { ScoreCategories } from './scoring';

export type SyncStatus = 'local' | 'pending' | 'submitted' | 'failed';

export interface CourseInfo {
  courseName: string;
  city: string;
  state: string;
  datePlayed: string;
  reviewerName: string;
  reviewerInitials: string;
  anonymous: boolean;
  teeTime: string;
  roundDuration: string;
  holes: 9 | 18;
  pricePaid: string;
  access: 'Public' | 'Private' | '';
  handicapRange: string;
  greensPunchStatus: string;
  placeId?: string;
}

export interface DescriptiveProfile {
  greenSpeed: string;
  greenFirmness: string;
  difficulty: string;
  forgiveness: string;
  walking: string;
  elevation: string;
  waterHazards: string;
  outOfBounds: string;
  bunkerQuantity: string;
  blindShots: string;
  gpsCarts: string;
}

export interface ReviewNotes {
  bestThing: string;
  biggestIssue: string;
  weatherNotes: string;
}

export interface Review {
  id: string;
  courseInfo: CourseInfo;
  scoreCategories: ScoreCategories;
  descriptiveProfile: DescriptiveProfile;
  amenities: string[];
  notes: ReviewNotes;
  weightedScore: number;
  letterGrade: string;
  syncStatus: SyncStatus;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
}

export const EMPTY_COURSE_INFO: CourseInfo = {
  courseName: '',
  city: '',
  state: '',
  datePlayed: new Date().toISOString().split('T')[0],
  reviewerName: '',
  reviewerInitials: '',
  anonymous: false,
  teeTime: '',
  roundDuration: '',
  holes: 18,
  pricePaid: '',
  access: '',
  handicapRange: '',
  greensPunchStatus: '',
};

export const EMPTY_DESCRIPTIVE: DescriptiveProfile = {
  greenSpeed: '',
  greenFirmness: '',
  difficulty: '',
  forgiveness: '',
  walking: '',
  elevation: '',
  waterHazards: '',
  outOfBounds: '',
  bunkerQuantity: '',
  blindShots: '',
  gpsCarts: '',
};

export const EMPTY_NOTES: ReviewNotes = {
  bestThing: '',
  biggestIssue: '',
  weatherNotes: '',
};

export const DESCRIPTIVE_OPTIONS: Record<keyof DescriptiveProfile, string[]> = {
  greenSpeed: ['Slow', 'Medium', 'Fast', 'Very Fast'],
  greenFirmness: ['Soft', 'Medium', 'Firm', 'Very Firm'],
  difficulty: ['Easy', 'Moderate', 'Challenging', 'Very Difficult', 'Championship'],
  forgiveness: ['Very Forgiving', 'Forgiving', 'Average', 'Punishing', 'Very Punishing'],
  walking: ['Walking Only', 'Walk Friendly', 'Cart Recommended', 'Cart Required'],
  elevation: ['Flat', 'Gentle Hills', 'Hilly', 'Very Hilly'],
  waterHazards: ['None', 'Minimal', 'Moderate', 'Significant'],
  outOfBounds: ['None', 'Minimal', 'Moderate', 'Significant'],
  bunkerQuantity: ['Few', 'Moderate', 'Many', 'Extensive'],
  blindShots: ['None', 'Few', 'Several', 'Many'],
  gpsCarts: ['Yes', 'No', 'Partial'],
};

export const AMENITY_GROUPS = {
  'Food & Amenities': [
    'Snack Bar',
    'Grill',
    'Restaurant',
    'Bar Lounge',
    'Beverage Cart',
  ],
  'Practice Setup': [
    'Putting Green',
    'Chipping Green',
    'Full Range',
    'Limited Range',
    'Short Game Area',
    'Practice Bunkers',
    'Indoor Simulator',
  ],
};

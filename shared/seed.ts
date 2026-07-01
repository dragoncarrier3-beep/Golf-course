import type { Review } from './types';
import {
  EMPTY_COURSE_INFO,
  EMPTY_DESCRIPTIVE,
  EMPTY_NOTES,
} from './types';

export const SEED_COURSES = [
  { name: 'Pebble Beach Golf Links', city: 'Pebble Beach', state: 'CA' },
  { name: 'Augusta National Golf Club', city: 'Augusta', state: 'GA' },
  { name: 'St Andrews Old Course', city: 'St Andrews', state: 'Scotland' },
];

export function createSeedSubmittedReview(): Review {
  const now = new Date().toISOString();
  return {
    id: 'seed-review-pebble',
    courseInfo: {
      ...EMPTY_COURSE_INFO,
      courseName: 'Pebble Beach Golf Links',
      city: 'Pebble Beach',
      state: 'CA',
      datePlayed: '2025-06-15',
      reviewerName: 'Demo Reviewer',
      reviewerInitials: 'DR',
      holes: 18,
      access: 'Public',
      pricePaid: '$595',
      roundDuration: '4h 30m',
    },
    scoreCategories: {
      greens_quality: 9,
      fairways: 9,
      value: 7,
      rough: 8,
      practice_facility: 9,
      tee_boxes: 9,
      fringes: 8,
      bunkers: 9,
      staff_operations: 9,
      layout_fun: 10,
    },
    descriptiveProfile: {
      ...EMPTY_DESCRIPTIVE,
      greenSpeed: 'Fast',
      difficulty: 'Challenging',
      forgiveness: 'Punishing',
      walking: 'Cart Recommended',
      elevation: 'Hilly',
    },
    amenities: ['Full Range', 'Restaurant'],
    notes: {
      bestThing: 'Iconic coastal holes with breathtaking views',
      biggestIssue: 'Premium pricing',
      weatherNotes: 'Clear skies, light ocean breeze',
    },
    weightedScore: 8.7,
    letterGrade: 'A-',
    syncStatus: 'submitted',
    isDraft: false,
    createdAt: now,
    updatedAt: now,
    currentStep: 7,
  };
}

export function createSeedDraftReview(): Review {
  const now = new Date().toISOString();
  return {
    id: 'seed-draft-augusta',
    courseInfo: {
      ...EMPTY_COURSE_INFO,
      courseName: 'Augusta National Golf Club',
      city: 'Augusta',
      state: 'GA',
      datePlayed: new Date().toISOString().split('T')[0],
      reviewerName: 'Demo Reviewer',
      reviewerInitials: 'DR',
      holes: 18,
      access: 'Private',
    },
    scoreCategories: {
      greens_quality: 10,
      fairways: 10,
      value: 8,
      rough: 9,
      practice_facility: 10,
      tee_boxes: 10,
      fringes: 9,
      bunkers: 9,
      staff_operations: 10,
      layout_fun: 10,
    },
    descriptiveProfile: { ...EMPTY_DESCRIPTIVE },
    amenities: [],
    notes: { ...EMPTY_NOTES },
    weightedScore: 9.5,
    letterGrade: 'A+',
    syncStatus: 'local',
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    currentStep: 3,
  };
}

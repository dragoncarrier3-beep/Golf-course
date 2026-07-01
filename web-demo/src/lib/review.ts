import { v4 as uuid } from 'uuid';
import type { Review } from '@shared/types';
import {
  EMPTY_COURSE_INFO,
  EMPTY_DESCRIPTIVE,
  EMPTY_NOTES,
} from '@shared/types';
import { calculateWeightedScore, scoreToLetterGrade } from '@shared/scoring';
import type { CategoryWeight } from '@shared/scoring';
import {
  getReviewerIdentity,
  getScoreConfig,
  upsertReview,
} from './storage';

export function createNewReview(): Review {
  const identity = getReviewerIdentity();
  const now = new Date().toISOString();
  return {
    id: uuid(),
    courseInfo: {
      ...EMPTY_COURSE_INFO,
      reviewerName: identity.anonymous ? 'Anonymous' : identity.fullName,
      reviewerInitials: identity.initials,
      anonymous: identity.anonymous,
      datePlayed: new Date().toISOString().split('T')[0],
    },
    scoreCategories: {},
    descriptiveProfile: { ...EMPTY_DESCRIPTIVE },
    amenities: [],
    notes: { ...EMPTY_NOTES },
    weightedScore: 0,
    letterGrade: 'F',
    syncStatus: 'local',
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    currentStep: 1,
  };
}

export function recalculateReview(
  review: Review,
  config?: CategoryWeight[]
): Review {
  const cfg = config ?? getScoreConfig();
  const weightedScore = calculateWeightedScore(review.scoreCategories, cfg);
  const letterGrade = scoreToLetterGrade(weightedScore);
  return { ...review, weightedScore, letterGrade };
}

export function saveReviewDraft(review: Review, step?: number): Review {
  const updated = recalculateReview({
    ...review,
    isDraft: true,
    syncStatus: review.syncStatus === 'submitted' ? 'submitted' : 'local',
    currentStep: step ?? review.currentStep,
  });
  return upsertReview(updated);
}

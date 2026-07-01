import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { CategoryWeight } from '@shared/scoring';
import { DEFAULT_SCORE_CONFIG } from '@shared/scoring';
import type { Review } from '@shared/types';
import { getDb, isFirebaseConfigured } from './firebase';

const STORAGE_KEY = 'coursegrade_reviews_v1';
const CONFIG_KEY = 'coursegrade_score_config';
const IDENTITY_KEY = 'coursegrade_identity';
const SYNC_LOG_KEY = 'coursegrade_sync_logs';
const SEEDED_KEY = 'coursegrade_seeded';

export interface ReviewerIdentity {
  fullName: string;
  initials: string;
  anonymous: boolean;
}

export interface SyncLog {
  id: string;
  reviewId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: string;
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalReviews(): Review[] {
  return readLocal<Review[]>(STORAGE_KEY, []);
}

export function saveLocalReviews(reviews: Review[]): void {
  writeLocal(STORAGE_KEY, reviews);
}

export function getReviewerIdentity(): ReviewerIdentity {
  return readLocal<ReviewerIdentity>(IDENTITY_KEY, {
    fullName: '',
    initials: '',
    anonymous: false,
  });
}

export function saveReviewerIdentity(identity: ReviewerIdentity): void {
  writeLocal(IDENTITY_KEY, identity);
}

export function getScoreConfig(): CategoryWeight[] {
  return readLocal<CategoryWeight[]>(CONFIG_KEY, DEFAULT_SCORE_CONFIG);
}

export function saveScoreConfig(config: CategoryWeight[]): void {
  writeLocal(CONFIG_KEY, config);
}

export function getSyncLogs(): SyncLog[] {
  return readLocal<SyncLog[]>(SYNC_LOG_KEY, []);
}

function appendSyncLog(log: Omit<SyncLog, 'id' | 'timestamp'>): void {
  const logs = getSyncLogs();
  logs.unshift({
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  writeLocal(SYNC_LOG_KEY, logs.slice(0, 50));
}

export function isSeeded(): boolean {
  return localStorage.getItem(SEEDED_KEY) === 'true';
}

export function markSeeded(): void {
  localStorage.setItem(SEEDED_KEY, 'true');
}

export function upsertReview(review: Review): Review {
  const reviews = getLocalReviews();
  const idx = reviews.findIndex((r) => r.id === review.id);
  const updated = { ...review, updatedAt: new Date().toISOString() };
  if (idx >= 0) reviews[idx] = updated;
  else reviews.push(updated);
  saveLocalReviews(reviews);
  return updated;
}

export function getReview(id: string): Review | undefined {
  return getLocalReviews().find((r) => r.id === id);
}

export function getActiveDraft(): Review | undefined {
  return getLocalReviews().find((r) => r.isDraft);
}

export function getSubmittedReviews(): Review[] {
  return getLocalReviews().filter((r) => !r.isDraft);
}

export async function loadScoreConfigFromFirebase(): Promise<CategoryWeight[]> {
  if (!isFirebaseConfigured()) return getScoreConfig();
  try {
    const snap = await getDoc(doc(getDb(), 'score_config', 'default'));
    if (snap.exists()) {
      const data = snap.data();
      const categories = data.categories as CategoryWeight[];
      if (categories?.length) {
        saveScoreConfig(categories);
        return categories;
      }
    }
  } catch {
    /* offline — use cached */
  }
  return getScoreConfig();
}

export async function syncReviewToFirebase(review: Review): Promise<Review> {
  const pending: Review = { ...review, syncStatus: 'pending' };
  upsertReview(pending);

  if (!isFirebaseConfigured()) {
    const submitted = { ...pending, syncStatus: 'submitted' as const, isDraft: false };
    upsertReview(submitted);
    appendSyncLog({ reviewId: review.id, status: 'success', message: 'Saved locally (demo mode)' });
    return submitted;
  }

  try {
    const collectionName = review.isDraft ? 'draft_reviews' : 'reviews';
    await setDoc(doc(getDb(), collectionName, review.id), {
      ...review,
      syncedAt: serverTimestamp(),
    });
    const submitted: Review = {
      ...review,
      syncStatus: 'submitted',
      isDraft: false,
      updatedAt: new Date().toISOString(),
    };
    upsertReview(submitted);
    appendSyncLog({ reviewId: review.id, status: 'success', message: 'Synced to Firestore' });
    return submitted;
  } catch (err) {
    const failed: Review = { ...review, syncStatus: 'failed' };
    upsertReview(failed);
    appendSyncLog({
      reviewId: review.id,
      status: 'failed',
      message: err instanceof Error ? err.message : 'Sync failed',
    });
    return failed;
  }
}

export async function syncPendingReviews(): Promise<void> {
  const pending = getLocalReviews().filter(
    (r) => r.syncStatus === 'pending' || r.syncStatus === 'failed'
  );
  for (const review of pending) {
    await syncReviewToFirebase(review);
  }
}

export async function seedFirebaseIfConfigured(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    await setDoc(doc(getDb(), 'score_config', 'default'), {
      categories: DEFAULT_SCORE_CONFIG,
      updatedAt: serverTimestamp(),
    });
  } catch {
    /* demo continues offline */
  }
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Review } from '@shared/types';
import type { CategoryWeight } from '@shared/scoring';
import { createSeedDraftReview, createSeedSubmittedReview } from '@shared/seed';
import {
  getActiveDraft,
  getLocalReviews,
  isSeeded,
  markSeeded,
  loadScoreConfigFromFirebase,
  syncPendingReviews,
  isOnline,
  saveLocalReviews,
} from '../lib/storage';
import { saveReviewDraft } from '../lib/review';

interface AppState {
  reviews: Review[];
  activeReview: Review | null;
  scoreConfig: CategoryWeight[];
  online: boolean;
  initialized: boolean;
  setActiveReview: (review: Review | null) => void;
  refreshReviews: () => void;
  updateReview: (review: Review, step?: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [scoreConfig, setScoreConfig] = useState<CategoryWeight[]>([]);
  const [online, setOnline] = useState(isOnline());
  const [initialized, setInitialized] = useState(false);

  const refreshReviews = useCallback(() => {
    setReviews(getLocalReviews());
    setActiveReview(getActiveDraft() ?? null);
  }, []);

  const updateReview = useCallback((review: Review, step?: number) => {
    const saved = saveReviewDraft(review, step);
    setActiveReview(saved.isDraft ? saved : null);
    setReviews(getLocalReviews());
  }, []);

  useEffect(() => {
    async function init() {
      if (!isSeeded()) {
        const seedSubmitted = createSeedSubmittedReview();
        const seedDraft = createSeedDraftReview();
        saveLocalReviews([seedSubmitted, seedDraft]);
        markSeeded();
      }
      const config = await loadScoreConfigFromFirebase();
      setScoreConfig(config);
      refreshReviews();
      setInitialized(true);
      if (isOnline()) syncPendingReviews().then(refreshReviews);
    }
    init();
  }, [refreshReviews]);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      syncPendingReviews().then(refreshReviews);
    };
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [refreshReviews]);

  return (
    <AppContext.Provider
      value={{
        reviews,
        activeReview,
        scoreConfig,
        online,
        initialized,
        setActiveReview,
        refreshReviews,
        updateReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

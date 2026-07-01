import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, GradeBadge, SyncBadge } from '../components/UI';
import { useApp } from '../context/AppContext';
import { recalculateReview } from '../lib/review';
import { syncReviewToFirebase } from '../lib/storage';
import type { DescriptiveProfile } from '@shared/types';

const PROFILE_LABELS: Record<keyof DescriptiveProfile, string> = {
  greenSpeed: 'Green Speed',
  greenFirmness: 'Green Firmness',
  difficulty: 'Difficulty',
  forgiveness: 'Forgiveness',
  walking: 'Walking',
  elevation: 'Elevation',
  waterHazards: 'Water Hazards',
  outOfBounds: 'Out of Bounds',
  bunkerQuantity: 'Bunker Quantity',
  blindShots: 'Blind Shots',
  gpsCarts: 'GPS Carts',
};

export function SummaryScreen() {
  const navigate = useNavigate();
  const { activeReview, scoreConfig, refreshReviews, setActiveReview } = useApp();
  const [submitting, setSubmitting] = useState(false);

  if (!activeReview) {
    navigate('/');
    return null;
  }

  const review = recalculateReview(activeReview, scoreConfig);
  const { courseInfo, descriptiveProfile, amenities, notes } = review;

  const profileTags = (Object.keys(PROFILE_LABELS) as Array<keyof DescriptiveProfile>)
    .filter((k) => descriptiveProfile[k])
    .map((k) => ({ label: PROFILE_LABELS[k], value: descriptiveProfile[k] }));

  const allTags = [
    ...profileTags.map((t) => `${t.label}: ${t.value}`),
    ...amenities,
  ];

  const submit = async () => {
    setSubmitting(true);
    const toSubmit = { ...review, isDraft: false, syncStatus: 'pending' as const, currentStep: 6 };
    await syncReviewToFirebase(toSubmit);
    setActiveReview(null);
    refreshReviews();
    setSubmitting(false);
    navigate('/review/confirmation');
  };

  return (
    <Shell title="Review Summary" step={6} backTo="/review/notes">
      <div className="summary-hero">
        <h2>{courseInfo.courseName || 'Unnamed Course'}</h2>
        <p className="summary-meta">
          {courseInfo.city}
          {courseInfo.state ? `, ${courseInfo.state}` : ''} · Played {courseInfo.datePlayed}
        </p>
        <GradeBadge grade={review.letterGrade} score={review.weightedScore} size="lg" />
        <SyncBadge status={review.syncStatus} />
      </div>

      <section className="summary-section">
        <h3>Category Scores</h3>
        <div className="score-grid">
          {scoreConfig.map((cat) => (
            <div key={cat.id} className="score-grid-item">
              <span>{cat.name}</span>
              <strong>{review.scoreCategories[cat.id] ?? '—'}</strong>
            </div>
          ))}
        </div>
      </section>

      {allTags.length > 0 && (
        <section className="summary-section">
          <h3>Tags</h3>
          <div className="tag-list">
            {allTags.map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
        </section>
      )}

      {(notes.bestThing || notes.biggestIssue || notes.weatherNotes) && (
        <section className="summary-section">
          <h3>Notes</h3>
          {notes.bestThing && <p><strong>Best:</strong> {notes.bestThing}</p>}
          {notes.biggestIssue && <p><strong>Issue:</strong> {notes.biggestIssue}</p>}
          {notes.weatherNotes && <p><strong>Weather:</strong> {notes.weatherNotes}</p>}
        </section>
      )}

      <div className="edit-links">
        <button type="button" onClick={() => navigate('/review/course-info')}>Edit Course Info</button>
        <button type="button" onClick={() => navigate('/review/scores')}>Edit Scores</button>
        <button type="button" onClick={() => navigate('/review/profile')}>Edit Profile</button>
      </div>

      <div className="nav-actions">
        <Button fullWidth onClick={submit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Review'}
        </Button>
      </div>
    </Shell>
  );
}

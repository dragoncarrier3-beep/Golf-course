import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { GradeBadge, SyncBadge } from '../components/UI';
import { useApp } from '../context/AppContext';
import { getSubmittedReviews } from '../lib/storage';

export function ReviewsListScreen() {
  const navigate = useNavigate();
  const { refreshReviews } = useApp();
  const reviews = getSubmittedReviews().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Shell title="My Reviews" showProgress={false} backTo="/">
      {reviews.length === 0 ? (
        <div className="empty-state">
          <p>No submitted reviews yet.</p>
          <button type="button" className="link-btn" onClick={() => navigate('/')}>
            Start your first review
          </button>
        </div>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review-card">
              <div className="review-card-top">
                <div>
                  <h3>{r.courseInfo.courseName}</h3>
                  <p className="review-card-meta">
                    {r.courseInfo.city}, {r.courseInfo.state} · {r.courseInfo.datePlayed}
                  </p>
                </div>
                <GradeBadge grade={r.letterGrade} score={r.weightedScore} />
              </div>
              <div className="review-card-tags">
                {r.descriptiveProfile.greenSpeed && (
                  <span className="tag-pill">{r.descriptiveProfile.greenSpeed} Greens</span>
                )}
                {r.descriptiveProfile.difficulty && (
                  <span className="tag-pill">{r.descriptiveProfile.difficulty}</span>
                )}
                {r.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="tag-pill">{a}</span>
                ))}
              </div>
              <SyncBadge status={r.syncStatus} />
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="refresh-link" onClick={refreshReviews}>
        Refresh
      </button>
    </Shell>
  );
}

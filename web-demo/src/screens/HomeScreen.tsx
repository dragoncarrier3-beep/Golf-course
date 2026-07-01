import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button } from '../components/UI';
import { useApp } from '../context/AppContext';
import { createNewReview } from '../lib/review';
import { getSubmittedReviews } from '../lib/storage';

export function HomeScreen() {
  const navigate = useNavigate();
  const { activeReview, refreshReviews, setActiveReview } = useApp();
  const submitted = getSubmittedReviews();

  const startNew = () => {
    const review = createNewReview();
    setActiveReview(review);
    navigate('/review/course-info');
  };

  const continueDraft = () => {
    if (!activeReview) return;
    const routes = [
      '/review/course-info',
      '/review/scores',
      '/review/profile',
      '/review/amenities',
      '/review/notes',
      '/review/summary',
    ];
    const step = Math.min(activeReview.currentStep, routes.length - 1);
    navigate(routes[step] ?? routes[0]);
  };

  return (
    <Shell title="Golf Course Reviews" showProgress={false}>
      <div className="home-hero">
        <div className="hero-badge">Offline-First Intelligence</div>
        <h2>Rate courses with precision.</h2>
        <p>
          Structured reviews, weighted scoring, and automatic sync — even without
          signal on the course.
        </p>
      </div>

      <div className="home-actions">
        <Button fullWidth onClick={startNew}>
          Start New Review
        </Button>

        {activeReview && (
          <div className="draft-card">
            <div className="draft-card-header">
              <span className="draft-label">Continue Saved Review</span>
              <span className="draft-step">Step {activeReview.currentStep + 1}</span>
            </div>
            <p className="draft-course">
              {activeReview.courseInfo.courseName || 'Untitled Course'}
            </p>
            <Button variant="secondary" fullWidth onClick={continueDraft}>
              Resume Draft
            </Button>
          </div>
        )}

        <Button variant="ghost" fullWidth onClick={() => { refreshReviews(); navigate('/reviews'); }}>
          My Submitted Reviews ({submitted.length})
        </Button>
      </div>

      <div className="home-footer">
        <p>Data saved locally first. Syncs when online.</p>
      </div>
    </Shell>
  );
}

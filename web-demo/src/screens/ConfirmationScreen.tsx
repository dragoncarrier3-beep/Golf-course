import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button } from '../components/UI';
import { createNewReview } from '../lib/review';
import { useApp } from '../context/AppContext';

export function ConfirmationScreen() {
  const navigate = useNavigate();
  const { setActiveReview } = useApp();

  const startAnother = () => {
    const review = createNewReview();
    setActiveReview(review);
    navigate('/review/course-info');
  };

  return (
    <Shell title="Submitted" showProgress={false} backTo="/">
      <div className="confirmation">
        <div className="confirmation-icon">✓</div>
        <h2>Review submitted.</h2>
        <p>Thank you for helping build CourseGrade.</p>
        <p className="confirmation-sub">
          Your review is saved locally and will sync to Firebase when online.
        </p>
        <div className="home-actions">
          <Button fullWidth onClick={startAnother}>
            Start Another Review
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/reviews')}>
            View My Reviews
          </Button>
        </div>
      </div>
    </Shell>
  );
}

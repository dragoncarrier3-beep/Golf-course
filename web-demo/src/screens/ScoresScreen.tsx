import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, ScoreSlider, GradeBadge } from '../components/UI';
import { useApp } from '../context/AppContext';
import { recalculateReview } from '../lib/review';

export function ScoresScreen() {
  const navigate = useNavigate();
  const { activeReview, updateReview, scoreConfig } = useApp();

  if (!activeReview) {
    navigate('/');
    return null;
  }

  const review = recalculateReview(activeReview, scoreConfig);

  const setScore = (id: string, value: number) => {
    updateReview(
      {
        ...review,
        scoreCategories: { ...review.scoreCategories, [id]: value },
      },
      2
    );
  };

  return (
    <Shell title="Scored Categories" step={2} backTo="/review/course-info">
      <div className="score-summary-card">
        <div>
          <p className="score-summary-label">Live Weighted Score</p>
          <p className="score-summary-hint">Updates as you rate each category</p>
        </div>
        <GradeBadge grade={review.letterGrade} score={review.weightedScore} size="lg" />
      </div>

      {scoreConfig.map((cat) => (
        <ScoreSlider
          key={cat.id}
          label={cat.name}
          weight={cat.weight}
          value={review.scoreCategories[cat.id] ?? 5}
          onChange={(v) => setScore(cat.id, v)}
        />
      ))}

      <div className="nav-actions">
        <Button fullWidth onClick={() => navigate('/review/profile')}>
          Continue to Profile
        </Button>
      </div>
    </Shell>
  );
}

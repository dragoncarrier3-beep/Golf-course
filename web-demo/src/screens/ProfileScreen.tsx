import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, Chip } from '../components/UI';
import { useApp } from '../context/AppContext';
import { DESCRIPTIVE_OPTIONS, type DescriptiveProfile } from '@shared/types';

const LABELS: Record<keyof DescriptiveProfile, string> = {
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

export function ProfileScreen() {
  const navigate = useNavigate();
  const { activeReview, updateReview } = useApp();

  if (!activeReview) {
    navigate('/');
    return null;
  }

  const profile = activeReview.descriptiveProfile;

  const setField = (key: keyof DescriptiveProfile, value: string) => {
    updateReview(
      {
        ...activeReview,
        descriptiveProfile: { ...profile, [key]: value },
      },
      3
    );
  };

  return (
    <Shell title="Descriptive Profile" step={3} backTo="/review/scores">
      <p className="screen-intro">Tags for course character — these do not affect your score.</p>

      {(Object.keys(LABELS) as Array<keyof DescriptiveProfile>).map((key) => (
        <div key={key} className="tag-group">
          <h3 className="tag-group-label">{LABELS[key]}</h3>
          <div className="chip-grid">
            {DESCRIPTIVE_OPTIONS[key].map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={profile[key] === opt}
                onClick={() => setField(key, profile[key] === opt ? '' : opt)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="nav-actions">
        <Button fullWidth onClick={() => navigate('/review/amenities')}>
          Continue to Amenities
        </Button>
      </div>
    </Shell>
  );
}

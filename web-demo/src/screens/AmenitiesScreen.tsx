import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, Chip } from '../components/UI';
import { useApp } from '../context/AppContext';
import { AMENITY_GROUPS } from '@shared/types';

export function AmenitiesScreen() {
  const navigate = useNavigate();
  const { activeReview, updateReview } = useApp();

  if (!activeReview) {
    navigate('/');
    return null;
  }

  const amenities = activeReview.amenities;

  const toggle = (item: string) => {
    const next = amenities.includes(item)
      ? amenities.filter((a) => a !== item)
      : [...amenities, item];
    updateReview({ ...activeReview, amenities: next }, 4);
  };

  return (
    <Shell title="Amenities" step={4} backTo="/review/profile">
      <p className="screen-intro">Select all that apply — stored as multi-select tags.</p>

      {Object.entries(AMENITY_GROUPS).map(([group, items]) => (
        <div key={group} className="tag-group">
          <h3 className="tag-group-label">{group}</h3>
          <div className="chip-grid">
            {items.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={amenities.includes(item)}
                onClick={() => toggle(item)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="nav-actions">
        <Button fullWidth onClick={() => navigate('/review/notes')}>
          Continue to Notes
        </Button>
      </div>
    </Shell>
  );
}

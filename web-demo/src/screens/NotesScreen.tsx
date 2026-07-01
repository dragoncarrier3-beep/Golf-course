import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, Field, TextArea } from '../components/UI';
import { useApp } from '../context/AppContext';
import type { ReviewNotes } from '@shared/types';

export function NotesScreen() {
  const navigate = useNavigate();
  const { activeReview, updateReview } = useApp();

  if (!activeReview) {
    navigate('/');
    return null;
  }

  const notes = activeReview.notes;

  const patch = (field: keyof ReviewNotes, value: string) => {
    updateReview(
      { ...activeReview, notes: { ...notes, [field]: value } },
      5
    );
  };

  return (
    <Shell title="Notes" step={5} backTo="/review/amenities">
      <p className="screen-intro">Optional — all fields auto-save offline.</p>

      <Field label="Best Thing">
        <TextArea
          placeholder="What stood out most?"
          value={notes.bestThing}
          onChange={(e) => patch('bestThing', e.target.value)}
        />
      </Field>

      <Field label="Biggest Issue">
        <TextArea
          placeholder="What could be improved?"
          value={notes.biggestIssue}
          onChange={(e) => patch('biggestIssue', e.target.value)}
        />
      </Field>

      <Field label="Weather Notes">
        <TextArea
          placeholder="Wind, rain, temperature…"
          value={notes.weatherNotes}
          onChange={(e) => patch('weatherNotes', e.target.value)}
        />
      </Field>

      <div className="nav-actions">
        <Button fullWidth onClick={() => navigate('/review/summary')}>
          Review Summary
        </Button>
      </div>
    </Shell>
  );
}

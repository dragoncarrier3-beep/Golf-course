import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, Field, Input, Select } from '../components/UI';
import { useApp } from '../context/AppContext';
import { searchGolfCourses, type PlaceResult } from '../lib/places';
import { saveReviewerIdentity, getReviewerIdentity } from '../lib/storage';
import type { CourseInfo } from '@shared/types';

export function CourseInfoScreen() {
  const navigate = useNavigate();
  const { activeReview, updateReview } = useApp();
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [identity, setIdentity] = useState(getReviewerIdentity());

  useEffect(() => {
    if (!activeReview) navigate('/');
  }, [activeReview, navigate]);

  if (!activeReview) return null;

  const info = activeReview.courseInfo;

  const patch = useCallback(
    (patch: Partial<CourseInfo>) => {
      updateReview(
        {
          ...activeReview,
          courseInfo: { ...info, ...patch },
        },
        1
      );
    },
    [activeReview, info, updateReview]
  );

  useEffect(() => {
    if (!search.trim()) {
      setPlaces([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      const results = await searchGolfCourses(search);
      setPlaces(results);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const selectPlace = (place: PlaceResult) => {
    patch({
      courseName: place.name,
      city: place.city,
      state: place.state,
      placeId: place.placeId,
    });
    setSearch('');
    setPlaces([]);
  };

  const saveIdentity = (field: keyof typeof identity, value: string | boolean) => {
    const next = { ...identity, [field]: value };
    setIdentity(next);
    saveReviewerIdentity(next);
    if (field === 'fullName') patch({ reviewerName: next.anonymous ? 'Anonymous' : (value as string) });
    if (field === 'initials') patch({ reviewerInitials: value as string });
    if (field === 'anonymous') {
      patch({
        anonymous: value as boolean,
        reviewerName: (value as boolean) ? 'Anonymous' : next.fullName,
      });
    }
  };

  return (
    <Shell title="Course Info" step={1} backTo="/">
      <Field label="Course Name">
        <Input
          placeholder="Search golf courses or type manually"
          value={search || info.courseName}
          onChange={(e) => {
            setSearch(e.target.value);
            patch({ courseName: e.target.value });
          }}
        />
        {searching && <span className="field-hint">Searching…</span>}
        {places.length > 0 && (
          <ul className="places-list">
            {places.map((p) => (
              <li key={p.placeId}>
                <button type="button" className="place-item" onClick={() => selectPlace(p)}>
                  <strong>{p.name}</strong>
                  <span>{p.formattedAddress}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      <div className="row-2">
        <Field label="City">
          <Input value={info.city} onChange={(e) => patch({ city: e.target.value })} />
        </Field>
        <Field label="State">
          <Input value={info.state} onChange={(e) => patch({ state: e.target.value })} />
        </Field>
      </div>

      <Field label="Date Played">
        <Input
          type="date"
          value={info.datePlayed}
          onChange={(e) => patch({ datePlayed: e.target.value })}
        />
      </Field>

      <div className="section-divider">Reviewer Identity</div>

      <Field label="Full Name">
        <Input
          value={identity.fullName}
          disabled={identity.anonymous}
          onChange={(e) => saveIdentity('fullName', e.target.value)}
        />
      </Field>
      <Field label="Initials">
        <Input
          value={identity.initials}
          maxLength={3}
          onChange={(e) => saveIdentity('initials', e.target.value.toUpperCase())}
        />
      </Field>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={identity.anonymous}
          onChange={(e) => saveIdentity('anonymous', e.target.checked)}
        />
        Submit anonymously
      </label>

      <div className="section-divider">Round Details</div>

      <div className="row-2">
        <Field label="Tee Time">
          <Input type="time" value={info.teeTime} onChange={(e) => patch({ teeTime: e.target.value })} />
        </Field>
        <Field label="Duration">
          <Input
            placeholder="e.g. 4h 15m"
            value={info.roundDuration}
            onChange={(e) => patch({ roundDuration: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Holes">
        <div className="toggle-group">
          {([9, 18] as const).map((h) => (
            <button
              key={h}
              type="button"
              className={`toggle-btn ${info.holes === h ? 'active' : ''}`}
              onClick={() => patch({ holes: h })}
            >
              {h} Holes
            </button>
          ))}
        </div>
      </Field>

      <Field label="Price Paid">
        <Input
          placeholder="$0"
          value={info.pricePaid}
          onChange={(e) => patch({ pricePaid: e.target.value })}
        />
      </Field>

      <Field label="Access">
        <Select
          value={info.access}
          onChange={(e) => patch({ access: e.target.value as CourseInfo['access'] })}
        >
          <option value="">Select…</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </Select>
      </Field>

      <Field label="Handicap Range">
        <Input
          placeholder="e.g. 5–15"
          value={info.handicapRange}
          onChange={(e) => patch({ handicapRange: e.target.value })}
        />
      </Field>

      <Field label="Greens Punch Status">
        <Input
          placeholder="e.g. Recently punched"
          value={info.greensPunchStatus}
          onChange={(e) => patch({ greensPunchStatus: e.target.value })}
        />
      </Field>

      <div className="nav-actions">
        <Button fullWidth onClick={() => navigate('/review/scores')}>
          Continue to Scoring
        </Button>
      </div>
    </Shell>
  );
}

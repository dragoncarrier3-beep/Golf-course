import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea" rows={3} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="select" {...props} />;
}

interface ScoreSliderProps {
  label: string;
  weight: number;
  value: number;
  onChange: (v: number) => void;
}

export function ScoreSlider({ label, weight, value, onChange }: ScoreSliderProps) {
  const v = value || 5;
  return (
    <div className="score-slider">
      <div className="score-slider-header">
        <span>{label}</span>
        <span className="score-meta">
          {Math.round(weight * 100)}% · <strong>{v}</strong>
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
      />
      <div className="range-labels">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'chip-selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

interface GradeBadgeProps {
  grade: string;
  score: number;
  size?: 'sm' | 'lg';
}

export function GradeBadge({ grade, score, size = 'sm' }: GradeBadgeProps) {
  return (
    <div className={`grade-badge grade-badge-${size}`}>
      <span className="grade-letter">{grade}</span>
      <span className="grade-score">{score.toFixed(1)}</span>
    </div>
  );
}

export function SyncBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    local: 'Saved Locally',
    pending: 'Pending Sync',
    submitted: 'Submitted',
    failed: 'Sync Failed — Retrying',
  };
  return <span className={`sync-badge sync-${status}`}>{labels[status] ?? status}</span>;
}

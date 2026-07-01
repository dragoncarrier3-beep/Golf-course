import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from '../context/AppContext';

interface ShellProps {
  title: string;
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  backTo?: string;
  showProgress?: boolean;
}

export function Shell({
  title,
  children,
  step,
  totalSteps = 7,
  backTo,
  showProgress = true,
}: ShellProps) {
  const { online } = useApp();
  const navigate = useNavigate();
  const progress = step ? (step / totalSteps) * 100 : 0;

  return (
    <div className="phone-frame">
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <span className={`status-pill ${online ? 'online' : 'offline'}`}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>
      <header className="app-header">
        {backTo ? (
          <button type="button" className="back-btn" onClick={() => navigate(backTo)}>
            ← Back
          </button>
        ) : (
          <Link to="/" className="logo-link">
            <span className="logo-icon">⛳</span>
            <span className="logo-text">CourseGrade</span>
          </Link>
        )}
        <h1 className="screen-title">{title}</h1>
      </header>
      {showProgress && step !== undefined && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span className="progress-label">
            Step {step} of {totalSteps}
          </span>
        </div>
      )}
      <main className="screen-content">{children}</main>
    </div>
  );
}

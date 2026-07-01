import { describe, it, expect } from 'vitest';
import {
  calculateWeightedScore,
  scoreToLetterGrade,
  DEFAULT_SCORE_CONFIG,
} from './scoring';

describe('CourseGrade scoring engine', () => {
  it('calculates Pebble Beach seed review as 8.7', () => {
    const categories = {
      greens_quality: 9,
      fairways: 9,
      value: 7,
      rough: 8,
      practice_facility: 9,
      tee_boxes: 9,
      fringes: 8,
      bunkers: 9,
      staff_operations: 9,
      layout_fun: 10,
    };
    expect(calculateWeightedScore(categories, DEFAULT_SCORE_CONFIG)).toBe(8.7);
  });

  it('maps 8.7 to A-', () => {
    expect(scoreToLetterGrade(8.7)).toBe('A-');
  });

  it('maps 9.5 to A+', () => {
    expect(scoreToLetterGrade(9.5)).toBe('A+');
  });

  it('maps below 4.5 to F', () => {
    expect(scoreToLetterGrade(4.4)).toBe('F');
  });

  it('rounds to 1 decimal', () => {
    const categories = Object.fromEntries(
      DEFAULT_SCORE_CONFIG.map((c) => [c.id, 7])
    );
    expect(calculateWeightedScore(categories)).toBe(7);
  });
});

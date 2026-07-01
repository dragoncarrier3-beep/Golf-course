/** CourseGrade scoring engine — single source of truth */

export interface CategoryWeight {
  id: string;
  name: string;
  weight: number; // decimal e.g. 0.15
}

export const DEFAULT_SCORE_CONFIG: CategoryWeight[] = [
  { id: 'greens_quality', name: 'Greens Quality', weight: 0.15 },
  { id: 'fairways', name: 'Fairways', weight: 0.13 },
  { id: 'value', name: 'Value', weight: 0.13 },
  { id: 'rough', name: 'Rough', weight: 0.11 },
  { id: 'practice_facility', name: 'Practice Facility', weight: 0.1 },
  { id: 'tee_boxes', name: 'Tee Boxes', weight: 0.09 },
  { id: 'fringes', name: 'Fringes', weight: 0.09 },
  { id: 'bunkers', name: 'Bunkers', weight: 0.08 },
  { id: 'staff_operations', name: 'Staff/Operations', weight: 0.08 },
  { id: 'layout_fun', name: 'Layout/Fun Factor', weight: 0.04 },
];

export type ScoreCategories = Record<string, number>;

export function calculateWeightedScore(
  categories: ScoreCategories,
  config: CategoryWeight[] = DEFAULT_SCORE_CONFIG
): number {
  let total = 0;
  for (const cat of config) {
    const score = categories[cat.id] ?? 0;
    total += score * cat.weight;
  }
  return Math.round(total * 10) / 10;
}

export function scoreToLetterGrade(score: number): string {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7.0) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5.0) return 'D+';
  if (score >= 4.5) return 'D';
  return 'F';
}

export const GRADE_COLORS: Record<string, string> = {
  'A+': '#1B7D3A',
  A: '#2E9E4F',
  'A-': '#3CB371',
  'B+': '#5BAE3C',
  'B': '#8BC34A',
  'B-': '#C5D93B',
  'C+': '#F5C518',
  C: '#F0A500',
  'C-': '#E67E22',
  'D+': '#E74C3C',
  D: '#C0392B',
  F: '#922B21',
};

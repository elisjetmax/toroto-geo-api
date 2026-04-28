export type InterventionStatus =
  | 'validated'
  | 'in_progress'
  | 'planned'
  | 'completed';
export const INTERVENTION_STATUSES: InterventionStatus[] = [
  'validated',
  'in_progress',
  'planned',
  'completed',
];

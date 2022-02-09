export const deficientItemStateOrder = [
  'completed',
  'incomplete',
  'overdue',
  'requires-action',
  'go-back',
  'requires-progress-update',
  'deferred',
  'pending',
  'closed'
];

export const deficientItemCurrentStateDescriptions = {
  completed:
    'The Deficient Item has been marked complete, and now needs Approval (Close) or Rejection (Go Back).',
  incomplete:
    'The Deficient Item was not completed on-time, and now needs to be Extended (Go Back), or Closed.',
  overdue:
    'The Deficient Item is now past due. A Reason Incomplete is now required, before an extension can be granted.',
  'requires-action':
    'Initial Due Date, Plan to Fix, and Responsibility Group required.',
  'go-back':
    'The Deficient Item now requires a new Due Date, Plan to Fix, and Responsibility Group set.',
  'requires-progress-update':
    'Deficient Item currently requires a Progress Note.',
  pending: 'Deficient Item needs to be completed before set Due Date.',
  deferred: 'Deficient Item has been deferred to a later date.'
};

export const deficientItemsHistoryTitles = {
  stateHistory: 'State History',
  responsibilityGroups: 'Responsibility Groups - History',
  plansToFix: 'Plans to Fix - History',
  completeNowReasons: 'Complete Now Reason - History',
  reasonsIncomplete: 'Reasons Incomplete - History',
  dueDates: 'Due Dates - History',
  deferredDates: 'Deferred Dates - History'
};

export const deficientItemResponsibilityGroups = [
  { value: 'site_level_in-house', label: 'Site Level, In-House' },
  {
    value: 'site_level_manages_vendor',
    label: 'Site Level, Managing Vendor'
  },
  { value: 'corporate', label: 'Corporate' },
  {
    value: 'corporate_manages_vendor',
    label: 'Corporate, Managing Vendor'
  }
];

export const deficientItemProgressNoteEditStates = [
  'pending',
  'requires-progress-update'
];

export const deficientItemPendingEligibleStates = [
  'go-back',
  'deferred',
  'requires-action',
  'requires-progress-update'
];

export default {
  deficientItemStateOrder,
  deficientItemCurrentStateDescriptions,
  deficientItemResponsibilityGroups,
  deficientItemProgressNoteEditStates
};

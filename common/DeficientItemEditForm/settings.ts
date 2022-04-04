// import ENV from '../../../../config/environment';
import {
  deficientItemStateOrder,
  deficientItemResponsibilityGroups,
  deficientItemProgressNoteEditStates,
  deficientItemPendingEligibleStates
} from '../../config/deficientItems';

export default {
  deficientItemStates: deficientItemStateOrder,
  deficientItemPendingEligibleStates,
  plansToFixEditStates: [
    'completed',
    'incomplete',
    'overdue',
    'requires-action',
    'go-back',
    'requires-progress-update',
    'pending',
    'closed'
  ],
  responsibilityGroups: Object.freeze(deficientItemResponsibilityGroups),
  progressNoteStates: [
    'requires-progress-update',
    'pending',
    'incomplete',
    'completed',
    'closed',
    'deferred'
  ],
  progressNoteEditStates: deficientItemProgressNoteEditStates,
  reasonIncompleteStates: ['overdue', 'incomplete', 'closed'],
  reasonIncompleteEditStates: ['overdue'],
  respGroupEditStates: [
    'completed',
    'incomplete',
    'overdue',
    'requires-action',
    'go-back',
    'requires-progress-update',
    'pending',
    'closed'
  ],
  dueDateEditStates: [
    'completed',
    'incomplete',
    'overdue',
    'requires-action',
    'go-back',
    'requires-progress-update',
    'pending',
    'closed'
  ],
  incompleteEligibleStates: ['overdue']
};

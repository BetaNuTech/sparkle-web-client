import { ChangeEvent, FunctionComponent } from 'react';
import moment from 'moment';
import DeficientItemModel from '../models/deficientItem';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import PlanToFix from './fields/PlanToFix';
import CompleteNowReason from './fields/CompleteNowReason';
import ProgressNotes from './fields/ProgressNotes';
import ReasonIncomplete from './fields/ReasonIncomplete';
import DueDate from './fields/DueDate';
import DeferredDate from './fields/DeferredDate';
import ResponsibilityGroups from './fields/ResponsibilityGroups';

const PROGRESS_NOTE_STATES = [
  'requires-progress-update',
  'pending',
  'incomplete',
  'completed',
  'closed',
  'deferred'
];

const PROGRESS_NOTE_EDIT_STATES = ['pending', 'requires-progress-update'];
const REASON_INCOMPLETE_STATES = ['overdue', 'incomplete', 'closed'];
const REASON_INCOMPLETE_EDIT_STATES = ['overdue', 'incomplete'];

interface Props {
  onShowHistory?(): void;
  isMobile?: boolean;
  updates: DeficientItemModel;
  isUpdatingCurrentCompleteNowReason?: boolean;
  isUpdatingDeferredDate?: boolean;
  deficientItem: DeficientItemModel;
  onShowPlanToFix?(): void;
  onChangePlanToFix?(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowCompleteNowReason?(): void;
  onChangeCompleteNowReason?(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowProgressNotes?(): void;
  onChangeProgressNote?(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowReasonIncomplete?(): void;
  onChangeReasonIncomplete?(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowDueDates?(): void;
  onChangeDueDate?(evt: ChangeEvent<HTMLInputElement>): void;
  onChangeDeferredDate?(evt: ChangeEvent<HTMLInputElement>): void;
  onShowDeferredDates?(): void;
  onShowResponsibilityGroups?(): void;
  onChangeResponsibilityGroup?(evt: ChangeEvent<HTMLSelectElement>): void;
  isBulkUpdate?: boolean;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  updates,
  isUpdatingCurrentCompleteNowReason,
  isUpdatingDeferredDate,
  onShowHistory,
  onShowPlanToFix,
  onChangePlanToFix,
  onShowCompleteNowReason,
  onChangeCompleteNowReason,
  onShowProgressNotes,
  onChangeProgressNote,
  onShowReasonIncomplete,
  onChangeReasonIncomplete,
  onShowDueDates,
  onChangeDueDate,
  onChangeDeferredDate,
  onShowDeferredDates,
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup,
  isBulkUpdate
}) => {
  // set default date to tomorrow
  const defaultDate = moment().add(1, 'days').format('YYYY-MM-DD');

  // set maximum selectable date to 2 weeks from current date
  const maxDate = moment().add(14, 'days').format('YYYY-MM-DD');

  const showNotes = Boolean(deficientItem.itemInspectorNotes) && !isBulkUpdate;

  const isDeferred = deficientItem.state === 'deferred';

  // Determine to show/hide plan to fix section
  const showCurrentPlanToFixSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.currentPlanToFix)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  const showCompleteNowReasonSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.completeNowReasons)
      : isUpdatingCurrentCompleteNowReason;

  const hasEditableCompleteNowReason =
    deficientItem.state === 'requires-action';

  const hasEditableProgressNotes = PROGRESS_NOTE_EDIT_STATES.includes(
    deficientItem.state
  );
  const showProgressNotesSection =
    PROGRESS_NOTE_STATES.includes(deficientItem.state) &&
    !isUpdatingDeferredDate &&
    (hasEditableProgressNotes || Boolean(deficientItem.progressNotes));
  // Determine to show/hide reason incomplete section
  const showReasonIncompleteSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.currentReasonIncomplete)
      : REASON_INCOMPLETE_STATES.includes(deficientItem.state) &&
        (Boolean(deficientItem.reasonsIncomplete) ||
          REASON_INCOMPLETE_EDIT_STATES.includes(deficientItem.state));

  // Determine to show/hide due date section
  const showCurrentDueDateSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.currentDueDate)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  // Determine to show/hide due date section
  const showCurrentDeferredDateSection =
    deficientItem.state === 'deferred' || isUpdatingDeferredDate;

  // Determine to show/hide responsibility section
  const showResponsibilityGroupSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.currentResponsibilityGroup)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  return (
    <>
      <Notes deficientItem={deficientItem} isVisible={showNotes} />
      <CurrentState
        deficientItem={deficientItem}
        onShowHistory={onShowHistory}
        isMobile={isMobile}
        isVisible={!isBulkUpdate}
      />
      <PlanToFix
        onShowHistory={onShowPlanToFix}
        onChange={onChangePlanToFix}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showCurrentPlanToFixSection}
        isBulkUpdate={isBulkUpdate}
      />
      <ResponsibilityGroups
        onShowHistory={onShowResponsibilityGroups}
        onChange={onChangeResponsibilityGroup}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showResponsibilityGroupSection}
        isBulkUpdate={isBulkUpdate}
      />
      <DueDate
        onShowHistory={onShowDueDates}
        onChange={onChangeDueDate}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showCurrentDueDateSection}
        defaultDate={defaultDate}
        maxDate={maxDate}
        isBulkUpdate={isBulkUpdate}
      />
      <DeferredDate
        onShowHistory={onShowDeferredDates}
        onChange={onChangeDeferredDate}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showCurrentDeferredDateSection}
        defaultDate={defaultDate}
        isBulkUpdate={isBulkUpdate}
      />
      <ProgressNotes
        onShowHistory={onShowProgressNotes}
        onChange={onChangeProgressNote}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showProgressNotesSection}
        isEditable={hasEditableProgressNotes}
        isBulkUpdate={isBulkUpdate}
      />
      <ReasonIncomplete
        onShowHistory={onShowReasonIncomplete}
        onChange={onChangeReasonIncomplete}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showReasonIncompleteSection}
        isBulkUpdate={isBulkUpdate}
      />
      <CompleteNowReason
        onShowHistory={onShowCompleteNowReason}
        onChange={onChangeCompleteNowReason}
        deficientItem={deficientItem}
        updates={updates}
        isMobile={isMobile}
        isVisible={showCompleteNowReasonSection}
        isEditable={hasEditableCompleteNowReason}
        isBulkUpdate={isBulkUpdate}
      />
    </>
  );
};

DeficientItemEditForm.defaultProps = {
  isBulkUpdate: false,
  isMobile: false,
  isUpdatingDeferredDate: false,
  isUpdatingCurrentCompleteNowReason: false,
  onShowHistory: () => {}, // eslint-disable-line
  onShowPlanToFix: () => {}, // eslint-disable-line
  onShowCompleteNowReason: () => {}, // eslint-disable-line
  onShowProgressNotes: () => {}, // eslint-disable-line
  onShowReasonIncomplete: () => {}, // eslint-disable-line
  onShowDueDates: () => {}, // eslint-disable-line
  onShowDeferredDates: () => {}, // eslint-disable-line
  onShowResponsibilityGroups: () => {}, // eslint-disable-line
  onChangePlanToFix: () => {}, // eslint-disable-line
  onChangeCompleteNowReason: () => {}, // eslint-disable-line
  onChangeProgressNote: () => {}, // eslint-disable-line
  onChangeReasonIncomplete: () => {}, // eslint-disable-line
  onChangeDueDate: () => {}, // eslint-disable-line
  onChangeDeferredDate: () => {}, // eslint-disable-line
  onChangeResponsibilityGroup: () => {} // eslint-disable-line
};

export default DeficientItemEditForm;

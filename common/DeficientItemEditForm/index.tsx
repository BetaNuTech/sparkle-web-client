import { ChangeEvent, FunctionComponent } from 'react';
import moment from 'moment';
import DeficientItemModel from '../models/deficientItem';

import UserModel from '../models/user';
import Details from './fields/Details';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import PlanToFix from './fields/PlanToFix';
import CompleteNowReason from './fields/CompleteNowReason';
import ProgressNotes from './fields/ProgressNotes';
import ReasonIncomplete from './fields/ReasonIncomplete';
import DueDate from './fields/DueDate';
import ResponsibilityGroups from './fields/ResponsibilityGroups';
import Actions from './fields/Actions';

import styles from './styles.module.scss';

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
  user: UserModel;
  onShowHistory(): void;
  isMobile: boolean;
  isSaving: boolean;
  deficientItemUpdates: DeficientItemModel;
  isUpdatingCurrentCompleteNowReason: boolean;
  isUpdatingDeferredDate: boolean;
  onClickViewPhotos(): void;
  deficientItem: DeficientItemModel;
  onShowPlanToFix(): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowCompleteNowReason(): void;
  onChangeCompleteNowReason(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowProgressNotes(): void;
  onChangeProgressNote(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowReasonIncomplete(): void;
  onChangeReasonIncomplete(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowDueDates(): void;
  onChangeDueDate(evt: ChangeEvent<HTMLInputElement>): void;
  onShowResponsibilityGroups(): void;
  onChangeResponsibilityGroup(evt: ChangeEvent<HTMLSelectElement>): void;
  onUpdatePending(): void;
  onUnpermittedPending(): void;
  onAddProgressNote(): void;
  onUpdateIncomplete(): void;
  onComplete(): void;
  onGoBack(): void;
  onCloseDuplicate(): void;
  onUnpermittedDuplicate(): void;
  onClose(): void;
  onCancelCompleteNow(): void;
  onConfirmCompleteNow(): void;
  onCompleteNow(): void;
  onCancelDefer(): void;
  onConfirmDefer(): void;
  onInitiateDefer(): void;
  onUnpermittedDefer(): void;
  onShowCompletedPhotos(): void;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  user,
  deficientItem,
  isMobile,
  isSaving,
  deficientItemUpdates,
  isUpdatingCurrentCompleteNowReason,
  isUpdatingDeferredDate,
  onShowHistory,
  onClickViewPhotos,
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
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup,
  onUpdatePending,
  onUnpermittedPending,
  onAddProgressNote,
  onUpdateIncomplete,
  onComplete,
  onGoBack,
  onCloseDuplicate,
  onUnpermittedDuplicate,
  onClose,
  onCancelCompleteNow,
  onConfirmCompleteNow,
  onCompleteNow,
  onCancelDefer,
  onConfirmDefer,
  onInitiateDefer,
  onUnpermittedDefer,
  onShowCompletedPhotos
}) => {
  // set default date to tomorrow
  const defaultDate = moment().add(1, 'days').format('YYYY-MM-DD');

  // set maximum selectable date to 2 weeks from current date
  const maxDate = moment().add(14, 'days').format('YYYY-MM-DD');

  const showNotes = Boolean(deficientItem.itemInspectorNotes);

  const isDeferred = deficientItem.state === 'deferred';

  // Determine to show/hide plan to fix section
  const showCurrentPlanToFixSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.plansToFix)
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
    REASON_INCOMPLETE_STATES.includes(deficientItem.state) &&
    (Boolean(deficientItem.reasonsIncomplete) ||
      REASON_INCOMPLETE_EDIT_STATES.includes(deficientItem.state));

  // Determine to show/hide due date section
  const showCurrentDueDateSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.dueDates)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  // Determine to show/hide responsibility section
  const showResponsibilityGroupSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.responsibilityGroups)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  return (
    <div className={styles.container}>
      <aside className={styles.container__sidebar}>
        <Details
          deficientItem={deficientItem}
          isMobile={isMobile}
          onClickViewPhotos={onClickViewPhotos}
        />
      </aside>
      <div className={styles.container__main}>
        <Notes deficientItem={deficientItem} isVisible={showNotes} />
        <CurrentState
          deficientItem={deficientItem}
          onShowHistory={onShowHistory}
          isMobile={isMobile}
        />
        <PlanToFix
          onShowPlanToFix={onShowPlanToFix}
          onChangePlanToFix={onChangePlanToFix}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showCurrentPlanToFixSection}
        />
        <ResponsibilityGroups
          onShowResponsibilityGroups={onShowResponsibilityGroups}
          onChangeResponsibilityGroup={onChangeResponsibilityGroup}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showResponsibilityGroupSection}
        />
        <DueDate
          onShowDueDates={onShowDueDates}
          onChangeDueDate={onChangeDueDate}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showCurrentDueDateSection}
          defaultDate={defaultDate}
          maxDate={maxDate}
        />
        <ProgressNotes
          onShowProgressNotes={onShowProgressNotes}
          onChangeProgressNote={onChangeProgressNote}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showProgressNotesSection}
          isEditable={hasEditableProgressNotes}
        />
        <ReasonIncomplete
          onShowReasonIncomplete={onShowReasonIncomplete}
          onChangeReasonIncomplete={onChangeReasonIncomplete}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showReasonIncompleteSection}
        />
        <CompleteNowReason
          onShowCompleteNowReason={onShowCompleteNowReason}
          onChangeCompleteNowReason={onChangeCompleteNowReason}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showCompleteNowReasonSection}
          isEditable={hasEditableCompleteNowReason}
        />
        {isMobile && (
          <Actions
            user={user}
            deficientItem={deficientItem}
            deficientItemUpdates={deficientItemUpdates}
            isSaving={isSaving}
            isUpdatingCurrentCompleteNowReason={
              isUpdatingCurrentCompleteNowReason
            }
            isUpdatingDeferredDate={isUpdatingDeferredDate}
            onUpdatePending={onUpdatePending}
            onUnpermittedPending={onUnpermittedPending}
            onAddProgressNote={onAddProgressNote}
            onUpdateIncomplete={onUpdateIncomplete}
            onComplete={onComplete}
            onGoBack={onGoBack}
            onCloseDuplicate={onCloseDuplicate}
            onUnpermittedDuplicate={onUnpermittedDuplicate}
            onClose={onClose}
            onCancelCompleteNow={onCancelCompleteNow}
            onConfirmCompleteNow={onConfirmCompleteNow}
            onCompleteNow={onCompleteNow}
            onCancelDefer={onCancelDefer}
            onConfirmDefer={onConfirmDefer}
            onInitiateDefer={onInitiateDefer}
            onUnpermittedDefer={onUnpermittedDefer}
            onShowCompletedPhotos={onShowCompletedPhotos}
          />
        )}
      </div>
    </div>
  );
};

export default DeficientItemEditForm;

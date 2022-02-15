import { ChangeEvent, FunctionComponent } from 'react';
import moment from 'moment';
import PropertyTrelloIntegrationModal from '../models/propertyTrelloIntegration';
import PropertyModel from '../models/property';
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
import DeferredDate from './fields/DeferredDate';
import ResponsibilityGroups from './fields/ResponsibilityGroups';
import TrelloCard from './fields/TrelloCard';
import Actions from './fields/Actions';
import { canCreateTrelloCard } from '../utils/userPermissions';

import styles from './styles.module.scss';
import DueDatePill from './fields/DueDatePill';
import ResponsibilityGroupPill from './fields/ResponsibilityGroupPill';

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
const HIDE_CREATE_CARD_STATES = ['closed'];

interface Props {
  user: UserModel;
  property: PropertyModel;
  onShowHistory(): void;
  isMobile: boolean;
  isLargeDesktop: boolean;
  isOnline: boolean;
  isSaving: boolean;
  updates: DeficientItemModel;
  isUpdatingCurrentCompleteNowReason: boolean;
  isUpdatingDeferredDate: boolean;
  onClickViewPhotos(): void;
  propertyIntegration: PropertyTrelloIntegrationModal;
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
  onChangeDeferredDate(evt: ChangeEvent<HTMLInputElement>): void;
  onShowDeferredDates(): void;
  onShowResponsibilityGroups(): void;
  onChangeResponsibilityGroup(evt: ChangeEvent<HTMLSelectElement>): void;
  onCreateTrelloCard(): void;
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
  isCreatingTrelloCard: boolean;
  hasUnpublishedPhotos: boolean;
  onAddCompletionPhotos(): void;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  user,
  property,
  deficientItem,
  propertyIntegration,
  isMobile,
  isLargeDesktop,
  isOnline,
  isSaving,
  updates,
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
  onChangeDeferredDate,
  onShowDeferredDates,
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup,
  onCreateTrelloCard,
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
  onShowCompletedPhotos,
  isCreatingTrelloCard,
  hasUnpublishedPhotos,
  onAddCompletionPhotos
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

  // Determine to show/hide due date section
  const showCurrentDeferredDateSection =
    deficientItem.state === 'deferred' || isUpdatingDeferredDate;

  // Determine to show/hide responsibility section
  const showResponsibilityGroupSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.responsibilityGroups)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  const canCreateTrello = canCreateTrelloCard(user);
  const hasOpenList = Boolean(propertyIntegration?.openList);

  const showTrelloCard = HIDE_CREATE_CARD_STATES.includes(deficientItem.state)
    ? Boolean(deficientItem.trelloCardURL)
    : canCreateTrello || Boolean(deficientItem?.trelloCardURL);

  const showDueDatePill = Boolean(deficientItem.currentDueDate);
  const showResponsibilityGroupPill = Boolean(
    deficientItem.currentResponsibilityGroup
  );

  return (
    <div className={styles.container}>
      {(isMobile || isLargeDesktop) && (
        <aside className={styles.container__sidebar}>
          <Details
            deficientItem={deficientItem}
            isMobile={isMobile}
            onClickViewPhotos={onClickViewPhotos}
          />
        </aside>
      )}
      <div className={styles.container__main}>
        <aside className={styles.container__formSidebar}>
          {!isMobile && (
            <>
              {!isLargeDesktop && (
                <Details
                  deficientItem={deficientItem}
                  isMobile={isMobile}
                  onClickViewPhotos={onClickViewPhotos}
                />
              )}
              <DueDatePill
                isVisible={showDueDatePill}
                deficientItem={deficientItem}
              />
              <ResponsibilityGroupPill
                isVisible={showResponsibilityGroupPill}
                deficientItem={deficientItem}
              />
              <TrelloCard
                isVisible={showTrelloCard}
                isOnline={isOnline}
                deficientItem={deficientItem}
                isLoading={isCreatingTrelloCard}
                onCreateTrelloCard={onCreateTrelloCard}
                propertyId={property.id}
                hasOpenList={hasOpenList}
                isPill={true} // eslint-disable-line react/jsx-boolean-value
              />
            </>
          )}
        </aside>
        <div className={styles.container__form}>
          <Notes deficientItem={deficientItem} isVisible={showNotes} />
          <CurrentState
            deficientItem={deficientItem}
            onShowHistory={onShowHistory}
            isMobile={isMobile}
          />
          <PlanToFix
            onShowHistory={onShowPlanToFix}
            onChange={onChangePlanToFix}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showCurrentPlanToFixSection}
          />
          <ResponsibilityGroups
            onShowHistory={onShowResponsibilityGroups}
            onChange={onChangeResponsibilityGroup}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showResponsibilityGroupSection}
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
          />
          <DeferredDate
            onShowHistory={onShowDeferredDates}
            onChange={onChangeDeferredDate}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showCurrentDeferredDateSection}
            defaultDate={defaultDate}
          />
          <ProgressNotes
            onShowHistory={onShowProgressNotes}
            onChange={onChangeProgressNote}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showProgressNotesSection}
            isEditable={hasEditableProgressNotes}
          />
          <ReasonIncomplete
            onShowHistory={onShowReasonIncomplete}
            onChange={onChangeReasonIncomplete}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showReasonIncompleteSection}
          />
          <CompleteNowReason
            onShowHistory={onShowCompleteNowReason}
            onChange={onChangeCompleteNowReason}
            deficientItem={deficientItem}
            updates={updates}
            isMobile={isMobile}
            isVisible={showCompleteNowReasonSection}
            isEditable={hasEditableCompleteNowReason}
          />
          {isMobile && (
            <Actions
              user={user}
              deficientItem={deficientItem}
              updates={updates}
              isSaving={isSaving}
              isOnline={isOnline}
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
              hasUnpublishedPhotos={hasUnpublishedPhotos}
              onAddCompletionPhotos={onAddCompletionPhotos}
            />
          )}
          {isMobile && (
            <TrelloCard
              isVisible={showTrelloCard}
              isOnline={isOnline}
              deficientItem={deficientItem}
              isLoading={isCreatingTrelloCard}
              onCreateTrelloCard={onCreateTrelloCard}
              propertyId={property.id}
              hasOpenList={hasOpenList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeficientItemEditForm;

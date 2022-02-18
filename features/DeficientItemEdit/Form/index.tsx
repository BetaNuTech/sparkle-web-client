import { ChangeEvent, FunctionComponent } from 'react';
import PropertyTrelloIntegrationModal from '../../../common/models/propertyTrelloIntegration';
import PropertyModel from '../../../common/models/property';
import DeficientItemModel from '../../../common/models/deficientItem';
import UserModel from '../../../common/models/user';
import Details from '../../../common/DeficientItemEditForm/fields/Details';
import TrelloCard from './TrelloCard';
import { canCreateTrelloCard } from '../../../common/utils/userPermissions';

import styles from './styles.module.scss';
import DeficientItemEditForm from '../../../common/DeficientItemEditForm';
import DueDatePill from './DueDatePill';
import ResponsibilityGroupPill from './ResponsibilityGroupPill';

import Actions from '../../../common/DeficientItemEditForm/Actions';

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

const DeficientItemForm: FunctionComponent<Props> = ({
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
          <DeficientItemEditForm
            onShowHistory={onShowHistory}
            isMobile={isMobile}
            updates={updates}
            isUpdatingCurrentCompleteNowReason={
              isUpdatingCurrentCompleteNowReason
            }
            isUpdatingDeferredDate={isUpdatingDeferredDate}
            deficientItem={deficientItem}
            onShowPlanToFix={onShowPlanToFix}
            onChangePlanToFix={onChangePlanToFix}
            onShowCompleteNowReason={onShowCompleteNowReason}
            onChangeCompleteNowReason={onChangeCompleteNowReason}
            onShowProgressNotes={onShowProgressNotes}
            onChangeProgressNote={onChangeProgressNote}
            onShowReasonIncomplete={onShowReasonIncomplete}
            onChangeReasonIncomplete={onChangeReasonIncomplete}
            onChangeDeferredDate={onChangeDeferredDate}
            onShowDeferredDates={onShowDeferredDates}
            onShowDueDates={onShowDueDates}
            onChangeDueDate={onChangeDueDate}
            onShowResponsibilityGroups={onShowResponsibilityGroups}
            onChangeResponsibilityGroup={onChangeResponsibilityGroup}
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

export default DeficientItemForm;

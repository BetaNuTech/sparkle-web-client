import { FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import UserModel from '../../../models/user';
import {
  deficientItemPendingEligibleStates,
  deficientItemProgressNoteEditStates
} from '../../../../config/deficientItems';
import {
  canGoBackDeficientItem,
  canCloseDeficientItem,
  canDeferDeficientItem,
  getLevelName
} from '../../../utils/userPermissions';
import dateUtil from '../../../utils/date';

import fieldStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  user: UserModel;
  deficientItemUpdates: DeficientItemModel;
  isSaving: boolean;
  isUpdatingCurrentCompleteNowReason: boolean;
  isUpdatingDeferredDate: boolean;
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
  inline?: boolean;
  showHeader?: boolean;
}

const DeficientItemEditFormActions: FunctionComponent<Props> = ({
  deficientItem,
  user,
  deficientItemUpdates,
  isSaving,
  isUpdatingCurrentCompleteNowReason,
  isUpdatingDeferredDate,
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
  inline,
  showHeader
}) => {
  const permissionLevel = getLevelName(user);

  const canClose = canCloseDeficientItem(user);
  const canDefer = canDeferDeficientItem(user);

  const showCompletedAction = deficientItem.state === 'pending';

  const isDeferred = deficientItem.state === 'deferred';

  const showGoBackAction =
    canGoBackDeficientItem(user) &&
    ['completed', 'incomplete', 'deferred'].includes(deficientItem.state);

  const showCloseAction =
    canClose && ['completed', 'incomplete'].includes(deficientItem.state);

  const showUpdateToPendingActions =
    deficientItemPendingEligibleStates.includes(deficientItem.state) &&
    (Boolean(deficientItemUpdates.currentPlanToFix) ||
      Boolean(deficientItemUpdates.currentResponsibilityGroup) ||
      Boolean(deficientItemUpdates.currentDueDate));

  const showUpdateAddProgressNoteAction =
    deficientItemProgressNoteEditStates.includes(deficientItem.state) &&
    Boolean(deficientItemUpdates.progressNote);

  const showUpdateToIncompleteAction =
    deficientItem.state === 'overdue' &&
    Boolean(deficientItemUpdates.currentReasonIncomplete);

  const showDeferAction =
    !isUpdatingCurrentCompleteNowReason &&
    ['requires-action', 'pending', 'go-back'].includes(deficientItem.state);

  const showCompleteNowAction = useMemo(() => {
    const hoursDifferenceFromCreated = dateUtil.getTimeDifferenceInHours(
      deficientItem.createdAt
    );
    const dayHours = 24;
    const daysDifferenceFromCreated = hoursDifferenceFromCreated / dayHours;
    if (isUpdatingDeferredDate || deficientItem.state !== 'requires-action') {
      return false;
    }
    if (permissionLevel === 'admin') {
      return true;
    }

    if (permissionLevel === 'corporate' && daysDifferenceFromCreated >= -7) {
      return true;
    }
    return daysDifferenceFromCreated >= -3;
  }, [deficientItem, isUpdatingDeferredDate, permissionLevel]);

  const showCompletedPhotosAction =
    deficientItem.completedPhotos &&
    !isUpdatingDeferredDate &&
    !isUpdatingCurrentCompleteNowReason &&
    !isDeferred &&
    deficientItem.state !== 'go-back';

  const isAbleToTransitionToPending =
    Boolean(deficientItemUpdates.currentPlanToFix) &&
    Boolean(deficientItemUpdates.currentResponsibilityGroup) &&
    Boolean(deficientItemUpdates.currentDueDate);
  const showDuplicateAction = isDeferred;

  const showDefer = showDeferAction && !isUpdatingDeferredDate;

  const isVisible =
    showCompletedPhotosAction ||
    showUpdateToPendingActions ||
    showUpdateAddProgressNoteAction ||
    showUpdateToIncompleteAction ||
    showCompletedAction ||
    showGoBackAction ||
    showDuplicateAction ||
    showCloseAction ||
    showCompleteNowAction ||
    showDeferAction;

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="action-item-actions">
      {showHeader && <header className={fieldStyles.label}>Action(s)</header>}
      <div
        className={clsx(
          fieldStyles.section__main,
          styles.main,
          inline && styles['main--grid']
        )}
      >
        {showCompletedPhotosAction && !inline && (
          <button
            className={clsx(fieldStyles.action, '-bgc-success')}
            disabled={isSaving}
            data-testid="action-show-completed-photos"
            onClick={onShowCompletedPhotos}
          >
            Show Completed Photo(s)
          </button>
        )}

        {showUpdateToPendingActions &&
          (isAbleToTransitionToPending ? (
            <button
              className={clsx(fieldStyles.action, '-bgc-success')}
              disabled={isSaving}
              data-testid="action-update-pending"
              onClick={onUpdatePending}
            >
              Save
            </button>
          ) : (
            <button
              className={clsx(fieldStyles.action, '-bgc-success')}
              disabled={isSaving}
              data-testid="action-unpermitted-pending"
              onClick={onUnpermittedPending}
            >
              Save
            </button>
          ))}

        {showUpdateAddProgressNoteAction && (
          <button
            className={clsx(fieldStyles.action, '-bgc-success')}
            disabled={isSaving}
            data-testid="action-add-progress-note"
            onClick={onAddProgressNote}
          >
            Save
          </button>
        )}

        {showUpdateToIncompleteAction && (
          <button
            className={clsx(fieldStyles.action, '-bgc-success')}
            disabled={isSaving}
            data-testid="action-update-incomplete"
            onClick={onUpdateIncomplete}
          >
            Save
          </button>
        )}

        {showCompletedAction && (
          <button
            className={clsx(fieldStyles.action, '-bgc-primary')}
            disabled={isSaving}
            data-testid="action-completed"
            onClick={onComplete}
          >
            Complete
          </button>
        )}

        {showGoBackAction && (
          <button
            className={clsx(
              fieldStyles.action,
              deficientItem.state === 'completed'
                ? '-bgc-alert'
                : '-bgc-primary'
            )}
            disabled={isSaving}
            data-testid="action-go-back"
            onClick={onGoBack}
          >
            Go Back
          </button>
        )}
        {/* Transition to Closed (as duplicate) */}
        {showDuplicateAction &&
          (canClose ? (
            <button
              className={clsx(fieldStyles.action, '-bgc-gray-light')}
              disabled={isSaving}
              data-testid="action-duplicate"
              onClick={onCloseDuplicate}
            >
              Close (Duplicate)
            </button>
          ) : (
            <button
              className={clsx(fieldStyles.action, '-bgc-gray-light')}
              disabled={isSaving}
              data-testid="action-unpermitted-duplicate"
              onClick={onUnpermittedDuplicate}
            >
              Close (Duplicate)
            </button>
          ))}
        {/* Transition to Closed */}
        {showCloseAction && (
          <button
            className={clsx(fieldStyles.action, '-bgc-success')}
            disabled={isSaving}
            data-testid="action-close"
            onClick={onClose}
          >
            Close
          </button>
        )}

        {/* Complete Now Action */}

        {showCompleteNowAction &&
          (isUpdatingCurrentCompleteNowReason ? (
            <>
              <button
                className={clsx(fieldStyles.action, '-bgc-med-dark')}
                disabled={isSaving}
                data-testid="action-cancel-complete-now"
                onClick={onCancelCompleteNow}
              >
                Cancel Complete Now
              </button>
              <button
                className={clsx(
                  fieldStyles.action,
                  isSaving || !deficientItemUpdates.currentCompleteNowReason
                    ? '-bgc-gray'
                    : '-bgc-primary-dark'
                )}
                disabled={
                  isSaving || !deficientItemUpdates.currentCompleteNowReason
                }
                data-testid="action-confirm-complete-now"
                onClick={onConfirmCompleteNow}
              >
                Confirm Complete Now
              </button>
            </>
          ) : (
            <button
              className={clsx(fieldStyles.action, '-bgc-primary-dark')}
              disabled={isSaving}
              data-testid="action-complete-now"
              onClick={onCompleteNow}
            >
              Complete Now
            </button>
          ))}

        {/* Defer Now Action */}

        {showDeferAction && isUpdatingDeferredDate && (
          <>
            <button
              className={clsx(fieldStyles.action, '-bgc-med-dark')}
              disabled={isSaving}
              data-testid="action-cancel-defer"
              onClick={onCancelDefer}
            >
              Cancel Defer
            </button>
            <button
              className={clsx(
                fieldStyles.action,
                isSaving || !deficientItemUpdates.currentDeferredDate
                  ? '-bgc-gray'
                  : '-bgc-orange'
              )}
              disabled={isSaving || !deficientItemUpdates.currentDeferredDate}
              data-testid="action-confirm-defer"
              onClick={onConfirmDefer}
            >
              Confirm Defer
            </button>
          </>
        )}

        {showDefer &&
          (canDefer ? (
            <button
              className={clsx(fieldStyles.action, '-bgc-orange')}
              disabled={isSaving}
              data-testid="action-defer"
              onClick={onInitiateDefer}
            >
              Defer
            </button>
          ) : (
            <button
              className={clsx(fieldStyles.action, '-bgc-orange')}
              disabled={isSaving}
              data-testid="action-unpermitted-defer"
              onClick={onUnpermittedDefer}
            >
              Defer
            </button>
          ))}

        {showCompletedPhotosAction && inline && (
          <button
            className={clsx(fieldStyles.action, '-bgc-success')}
            disabled={isSaving}
            data-testid="action-show-completed-photos"
            onClick={onShowCompletedPhotos}
          >
            Show Completed Photo(s)
          </button>
        )}
      </div>
    </section>
  );
};

DeficientItemEditFormActions.defaultProps = {
  inline: false,
  showHeader: true
};

export default DeficientItemEditFormActions;

import { useState } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import deficientItemUtils from '../../../common/utils/deficientItem';
import deficientItemsApi from '../../../common/services/api/deficientItems';
import errorReports from '../../../common/services/api/errorReports';
import BaseError from '../../../common/models/errors/baseError';
import deficientItemUpdates from '../../../common/services/indexedDB/deficientItemUpdates';
import DeficientItemLocalUpdates from '../../../common/models/deficientItems/unpublishedUpdates';

const PREFIX = 'features: DeficientItemEdit: hooks: useUpdateItem:';

type userNotifications = (message: string, options?: any) => any;

interface useUpdateItemResult {
  updates: DeficientItemModel;
  hasUpdates: boolean;
  isSaving: boolean;
  updateState(state: string): DeficientItemModel;
  updateCurrentDueDate(currentDueDate: number): DeficientItemModel;
  updateCurrentDeferredDate(currentDeferredDate: number): DeficientItemModel;
  updateCurrentPlanToFix(currentPlanToFix: string): DeficientItemModel;
  updateCurrentResponsibilityGroup(
    currentResponsibilityGroup: string
  ): DeficientItemModel;
  updateProgressNote(progressNote: string): DeficientItemModel;
  updateCurrentReasonIncomplete(
    currentReasonIncomplete: string
  ): DeficientItemModel;
  updateCurrentCompleteNowReason(
    currentCompleteNowReason: string
  ): DeficientItemModel;
  publish(): void;
}

export default function useUpdateItem(
  deficiencyId: string,
  propertyId: string,
  sendNotification: userNotifications,
  previousUpdates: DeficientItemLocalUpdates,
  currentItem: DeficientItemModel
): useUpdateItemResult {
  const [isSaving, setIsSaving] = useState(false);

  const [hasUpdates, setHasUpdates] = useState(
    isDeficientItemUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState(
    previousUpdates ? clone(previousUpdates || {}) : {}
  );
  //
  // Update Management
  //

  // Set latest deficient item updates in memory
  const applyLatestUpdates = (latestUpdates: DeficientItemModel) => {
    // Updated item has publishable state
    setHasUpdates(isDeficientItemUpdated(latestUpdates));

    // In memory save
    setUpdates({ ...latestUpdates });

    // Local database save
    persistUnpublishedUpdates({ ...latestUpdates });

    return latestUpdates;
  };

  // Create, update, or remove a local
  // deficient item update record based on
  // user's updates
  const persistUnpublishedUpdates = async (data: DeficientItemModel) => {
    const hasAnyUpdates = isDeficientItemUpdated(data);
    try {
      if (hasAnyUpdates) {
        // Create or add local template updates record
        await deficientItemUpdates.upsertRecord(
          propertyId,
          deficiencyId,
          currentItem.inspection,
          {
            ...data,
            createdAt: currentItem.updatedAt
          }
        );
      } else {
        // Remove unneeded/empty local template updates record
        await deficientItemUpdates.deleteRecord(deficiencyId);
      }
    } catch (err) {
      sendErrorReports([Error(`${PREFIX} persistUnpublishedUpdates: ${err}`)]);
    }
  };

  const updateState = (state: string): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { state })
    );

  const updateCurrentDueDate = (currentDueDate: number): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentDueDate })
    );

  const updateCurrentDeferredDate = (
    currentDeferredDate: number
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentDeferredDate })
    );

  const updateCurrentPlanToFix = (
    currentPlanToFix: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentPlanToFix })
    );

  const updateCurrentResponsibilityGroup = (
    currentResponsibilityGroup: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentResponsibilityGroup
      })
    );

  const updateProgressNote = (progressNote: string): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { progressNote })
    );

  const updateCurrentReasonIncomplete = (
    currentReasonIncomplete: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentReasonIncomplete
      })
    );

  const updateCurrentCompleteNowReason = (
    currentCompleteNowReason: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentCompleteNowReason
      })
    );

  const handleErrorResponse = (error: BaseError) => {
    sendNotification('Failed to update deficient item, please try again', {
      type: 'error'
    });
    sendErrorReports([Error(`${PREFIX} handleErrorResponse: ${error}`)]);
  };

  const publish = async () => {
    setIsSaving(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemsApi.update([deficiencyId], updates);

      sendNotification('Deficient item updated successfully', {
        type: 'success'
      });
    } catch (err) {
      handleErrorResponse(err);
    }
    applyLatestUpdates({} as DeficientItemModel);
    setIsSaving(false);
  };

  return {
    updates,
    hasUpdates,
    isSaving,
    updateState,
    updateCurrentDueDate,
    updateCurrentDeferredDate,
    updateCurrentPlanToFix,
    updateCurrentResponsibilityGroup,
    updateProgressNote,
    updateCurrentReasonIncomplete,
    updateCurrentCompleteNowReason,
    publish
  };
}

// Check if updates contain any
// relevant user update data
function isDeficientItemUpdated(updates?: any) {
  return Object.keys(updates || {}).length > 0;
}
// Deep clone an object
function clone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

function sendErrorReports(errors: Error[]) {
  errors.forEach((err) => {
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(err);
  });
}

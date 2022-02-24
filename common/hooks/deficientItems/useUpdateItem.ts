import { useState, useEffect } from 'react';
import DeficientItemModel from '../../models/deficientItem';
import deficientItemUtils from '../../utils/deficientItem';
import deficientItemsApi from '../../services/api/deficientItems';
import errorReports from '../../services/api/errorReports';
import deficientItemUpdates from '../../services/indexedDB/deficientItemUpdates';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';
import DeficientItemLocalPhotos from '../../models/deficientItems/unpublishedPhotos';
import publishPhotos from '../../../features/DeficientItemEdit/utils/publishPhotos';
import * as objectHelper from '../../utils/object';
import UserModal from '../../models/user';
import utilString from '../../utils/string';

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
  markAsDuplicate(): DeficientItemModel;
  publish(unpublishedPhotos?: DeficientItemLocalPhotos[]): Promise<boolean>;
  publishProgress: number;
  handlePermissionWarning(nextState: string): void;
  clearUpdates(): void;
}

export default function useUpdateItem(
  deficiencyId: string,
  propertyId: string,
  sendNotification: userNotifications,
  previousUpdates: DeficientItemLocalUpdates,
  currentItem: DeficientItemModel,
  user: UserModal,
  isBulkUpdate?: boolean,
  bulkUpdateIds: string[] = []
): useUpdateItemResult {
  const [isSaving, setIsSaving] = useState(false);

  const [hasUpdates, setHasUpdates] = useState(
    isDeficientItemUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState({} as DeficientItemModel);
  const [progress, setProgress] = useState(0);

  //
  // Update Management
  //

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

  // Set latest deficient item updates in memory
  const applyLatestUpdates = (
    latestUpdates: DeficientItemModel
  ): DeficientItemModel => {
    // Updated item has publishable state
    setHasUpdates(isDeficientItemUpdated(latestUpdates));

    // In memory save
    objectHelper.replaceContent(updates, latestUpdates || {});
    setUpdates({ ...updates });

    // Local database save
    if (!isBulkUpdate) {
      persistUnpublishedUpdates(updates);
    }
    return latestUpdates;
  };

  // Apply local updates
  // to global updates once
  // NOTE: use effect fixes inconsistent
  //       rendering issues with history
  useEffect(() => {
    if (previousUpdates) {
      applyLatestUpdates(clone(previousUpdates || {}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${previousUpdates}`]);

  const clearUpdates = () => {
    applyLatestUpdates({} as DeficientItemModel);
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

  const markAsDuplicate = (): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        isDuplicate: true
      })
    );

  // prompt validation error
  // based on next state of deficient item
  // and updates
  const handlePermissionWarning = (nextState: string) => {
    if (nextState === 'defer' || nextState === 'duplicate') {
      // eslint-disable-next-line no-alert
      alert(
        'Permission Denied: This action requires a corporate or admin user.'
      );
    } else if (nextState === 'pending') {
      let msg = 'Missing required information';
      if (!updates.currentPlanToFix) {
        msg = 'Current Plan to Fix is NOT SET';
      } else if (!updates.currentResponsibilityGroup) {
        msg = 'Current Responsibility Group is NOT SET';
      } else if (!updates.currentDueDate) {
        msg = 'Current Due Date is NOT SET';
      }
      // eslint-disable-next-line no-alert
      alert(`Save Error: ${msg}`);
    }
  };

  const calculateAndSetProgressValue =
    (totalBytes: number) => (uploadedBytes: number) => {
      // Add 20% for deficient item publish
      const bytesForUpload = totalBytes + totalBytes * 0.2;

      const calculatedProgress = (uploadedBytes / bytesForUpload) * 100;
      setProgress(calculatedProgress);
    };

  const publish = async (
    unpublishedPhotos: DeficientItemLocalPhotos[] = []
  ): Promise<boolean> => {
    setIsSaving(true);
    setProgress(0);

    // Calculate all files size
    // to calculate progress
    const totalBytes = unpublishedPhotos.reduce(
      (sum: number, file: DeficientItemLocalPhotos) => sum + file.size,
      0
    );

    const uploadedBytes = 0;
    const setProgressValue = calculateAndSetProgressValue(totalBytes);

    const photosErrors = [];
    const publishUpdatesError = [];

    // Upload photos
    const { successful: photoUploads, errors: photoUploadErrors } =
      await publishPhotos.uploadPhotos(
        deficiencyId,
        unpublishedPhotos,
        uploadedBytes,
        setProgressValue
      );

    // Save photo's data to unpublished updates
    const combinedPhotoUpdates = publishPhotos.addPhotoData(
      updates,
      currentItem,
      photoUploads,
      user.id
    );
    applyLatestUpdates(combinedPhotoUpdates);

    // Remove all uploaded photo from local database
    const { errors: photoRemoveErrors } = await publishPhotos.removePublished(
      photoUploads
    );

    // Combine all photo errors
    photosErrors.push(...photoUploadErrors, ...photoRemoveErrors);

    const hasUnpublishedPhotos = unpublishedPhotos.length > 0;

    const haveAllPhotosFailed =
      unpublishedPhotos.length === photoUploadErrors.length;

    // Proceed updating deficiency only when there's was either no
    // unpublished photos or there's at least one unpublished photo
    // that was successfully uploaded
    if (!hasUnpublishedPhotos || !haveAllPhotosFailed) {
      try {
        // eslint-disable-next-line import/no-named-as-default-member
        await deficientItemsApi.update(
          isBulkUpdate ? bulkUpdateIds : [deficiencyId],
          updates
        );
      } catch (err) {
        setIsSaving(false);
        publishUpdatesError.push(Error(`${PREFIX} publish: ${err}`));
      }
    }

    const errors = [...photosErrors, ...publishUpdatesError];
    sendErrorReports(errors);

    // User photo error notification if some photos failed to publish
    if (photosErrors.length > 0 && !haveAllPhotosFailed) {
      sendNotification(
        'Some deficient item photos failed to publish, please check your internet connection and try again',
        { type: 'error' }
      );
    }

    // User photo error notification if all photos failed to published
    if (photosErrors.length > 0 && haveAllPhotosFailed) {
      sendNotification(
        'All photos failed to publish, please try again or contact an admin',
        { type: 'error' }
      );
    }

    if (publishUpdatesError.length > 0 && !isBulkUpdate) {
      sendNotification('Failed to update deficient item, please try again', {
        type: 'error'
      });
    }

    if (publishUpdatesError.length > 0 && isBulkUpdate) {
      sendNotification(
        `Failed to update the selected deficient item${
          bulkUpdateIds.length > 1 && 's'
        } to ${utilString.dedash(updates?.state)} ${
          updates?.isDuplicate ? 'as duplicate' : ''
        }`,
        {
          type: 'error'
        }
      );
    }

    // send state transition notification
    // if DI state updated
    if (
      !isBulkUpdate &&
      publishUpdatesError.length < 1 &&
      updates.state &&
      updates.state !== currentItem.state
    ) {
      sendNotification(
        `Deficient item was moved from ${utilString.titleize(
          utilString.dedash(currentItem?.state)
        )} to ${utilString.titleize(utilString.dedash(updates?.state))}`,
        {
          type: 'info'
        }
      );
    }

    applyLatestUpdates({} as DeficientItemModel);
    setProgress(100);
    // Setting loader value after 100 ms
    // so user can see progress bar moved to 100%
    setTimeout(() => setIsSaving(false), 200);

    // Resetting progress
    setTimeout(() => setProgress(0), 300);
    return true;
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
    markAsDuplicate,
    publish,
    publishProgress: progress,
    handlePermissionWarning,
    clearUpdates
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

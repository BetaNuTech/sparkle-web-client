import { useState } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import deficientItemUtils from '../../../common/utils/deficientItem';
import deficientItemsApi from '../../../common/services/api/deficientItems';
import errorReports from '../../../common/services/api/errorReports';
import deficientItemUpdates from '../../../common/services/indexedDB/deficientItemUpdates';
import DeficientItemLocalUpdates from '../../../common/models/deficientItems/unpublishedUpdates';
import DeficientItemLocalPhotos from '../../../common/models/deficientItems/unpublishedPhotos';
import publishPhotos from '../utils/publishPhotos';
import * as objectHelper from '../../../common/utils/object';
import UserModal from '../../../common/models/user';

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
  publish(unpublishedPhotos?: DeficientItemLocalPhotos[]): Promise<boolean>;
  publishProgress: number;
}

export default function useUpdateItem(
  deficiencyId: string,
  propertyId: string,
  sendNotification: userNotifications,
  previousUpdates: DeficientItemLocalUpdates,
  currentItem: DeficientItemModel,
  user: UserModal
): useUpdateItemResult {
  const [isSaving, setIsSaving] = useState(false);

  const [hasUpdates, setHasUpdates] = useState(
    isDeficientItemUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState(
    previousUpdates ? clone(previousUpdates || {}) : {}
  );

  const [progress, setProgress] = useState(0);

  //
  // Update Management
  //

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
    persistUnpublishedUpdates(updates);
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
        await deficientItemsApi.update([deficiencyId], updates);
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

    if (publishUpdatesError.length > 0) {
      sendNotification('Failed to update deficient item, please try again', {
        type: 'error'
      });
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
    publish,
    publishProgress: progress
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

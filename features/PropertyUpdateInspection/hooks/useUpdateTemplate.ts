import { useState, useEffect } from 'react';
import useStorage from '../../../common/hooks/useStorage';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import unpublishedTemplateUpdatesModel from '../../../common/models/inspections/unpublishedTemplateUpdate';
import inspUtil from '../../../common/utils/inspection';
import * as objectHelper from '../../../common/utils/object';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';
import errorReports from '../../../common/services/api/errorReports';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';
import inspectionsApi from '../../../common/services/api/inspections';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import unpublishedPhotosModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';
import publishSignatures from '../utils/publishSignatures';
import publishPhotos from '../utils/publishPhotos';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import BaseError from '../../../common/models/errors/baseError';

const PREFIX = 'features: PropertyUpdateInspection: hooks: useUpdateTemplate:';

type userNotifications = (message: string, options?: any) => any;

interface Result {
  isPublishing: boolean;
  isAdminEditModeEnabled: boolean;
  hasUpdates: boolean;
  updates: inspectionTemplateUpdateModel;

  updateMainInputSelection(
    itemId: string,
    selectionIndex: number
  ): inspectionTemplateUpdateModel;

  updateTextInputValue(
    itemId: string,
    textInputValue: string
  ): inspectionTemplateUpdateModel;
  updateMainInputNotes(
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel;
  setItemIsNA(itemId: string, isItemNA: boolean): inspectionTemplateUpdateModel;
  addSection(sectionId: string): inspectionTemplateUpdateModel;
  updateInspectorNotes(
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel;
  removeSection(sectionId: string): inspectionTemplateUpdateModel;
  enableAdminEditMode(currentUser: userModel): void;
  disableAdminEditMode(): void;

  destroyUpdates(): void;
  publish(
    signatures: Map<string, unpublishedSignatureModel[]>,
    unpublishedItemPhotos: Map<string, unpublishedPhotosModel[]>
  ): Promise<void>;
  publishProgress: number;
}

export default function useInspectionItemUpdate(
  propertyId: string,
  inspectionId: string,
  previousUpdates: unpublishedTemplateUpdatesModel,
  currentTemplate: inspectionTemplateUpdateModel,
  sendNotification: userNotifications
): Result {
  const [isPublishing, setIsPublishing] = useState(false);
  const { uploadBase64FileToStorage } = useStorage();
  const [isAdminEditModeEnabled, setIsAdminEditModeEnabled] = useState(false);
  const [updateOption, setUpdateOption] = useState({});
  const [hasUpdates, setHasUpdates] = useState(
    isInspectionTemplateUpdated(previousUpdates ? previousUpdates.template : {})
  );
  const [updates, setUpdates] = useState({} as inspectionTemplateUpdateModel);
  const [progress, setProgress] = useState(0);

  //
  // Update Management
  //

  // Create, update, or remove a local
  // template update record based on user's
  // updates to the inspection
  const persistUnpublishedTemplateUpdates = async (
    data: inspectionTemplateUpdateModel
  ) => {
    const hasAnyUpdates = isInspectionTemplateUpdated(data);

    try {
      if (hasAnyUpdates) {
        // Create or add local template updates record
        await inspectionTemplateUpdates.upsertRecord(
          propertyId,
          inspectionId,
          data
        );
      } else {
        // Remove unneeded/empty local template updates record
        await inspectionTemplateUpdates.deleteRecordForInspection(inspectionId);
      }
    } catch (err) {
      sendErrorReports([
        Error(`${PREFIX} persistUnpublishedTemplateUpdates: ${err}`)
      ]);
    }
  };

  // Set latest inpsection updates
  // in memory and save them locally
  const applyLatestUpdates = (
    latestUpdates: inspectionTemplateUpdateModel
  ): inspectionTemplateUpdateModel => {
    // Updated template has publishable state
    setHasUpdates(isInspectionTemplateUpdated(latestUpdates));

    // Setup updated template for merging
    updates.items = updates.items || {};
    updates.sections = updates.sections || {};

    // Merge latest
    objectHelper.replaceContent(updates.items, latestUpdates.items || {});
    objectHelper.replaceContent(updates.sections, latestUpdates.sections || {});

    // Cleanup removals
    if (!Object.keys(updates.items || {}).length) delete updates.items;
    if (!Object.keys(updates.sections || {}).length) delete updates.sections;

    // In memory save
    setUpdates({ ...updates });

    // Local database save
    persistUnpublishedTemplateUpdates(updates);

    return updates;
  };

  // Apply local updates
  // to global updates once
  // NOTE: use effect fixes inconsistent
  //       rendering issues with history
  useEffect(() => {
    if (previousUpdates) {
      applyLatestUpdates(clone(previousUpdates.template || {}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${previousUpdates}`]);

  // Remove template updates from
  // memory and local database
  const destroyUpdates = async () => {
    try {
      await inspectionTemplateUpdates.deleteRecordForInspection(inspectionId);
      setHasUpdates(false);
      applyLatestUpdates({});
    } catch (err) {
      sendErrorReports([Error(`${PREFIX} destroyUpdates: failed ${err}`)]);
    }
  };

  //
  // Inspection Item Update Methods
  //

  // User selects new main input option
  const updateMainInputSelection = (
    itemId: string,
    selectionIndex: number
  ): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(
        updates,
        currentTemplate,
        {
          items: { [itemId]: { mainInputSelection: selectionIndex } }
        },
        updateOption
      )
    );

  const updateTextInputValue = (
    itemId: string,
    textInputValue: string
  ): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(
        updates,
        currentTemplate,
        {
          items: { [itemId]: { textInputValue } }
        },
        updateOption
      )
    );

  const updateMainInputNotes = (
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(
        updates,
        currentTemplate,
        {
          items: { [itemId]: { mainInputNotes: notes } }
        },
        updateOption
      )
    );

  const updateInspectorNotes = (
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(
        updates,
        currentTemplate,
        {
          items: { [itemId]: { inspectorNotes: notes } }
        },
        updateOption
      )
    );

  const setItemIsNA = (
    itemId: string,
    isItemNA: boolean
  ): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(
        updates,
        currentTemplate,
        {
          items: { [itemId]: { isItemNA } }
        },
        updateOption
      )
    );

  const addSection = (sectionId: string): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(updates, currentTemplate, {
        sections: { new: { cloneOf: sectionId } }
      })
    );

  const removeSection = (sectionId: string): inspectionTemplateUpdateModel =>
    applyLatestUpdates(
      inspUtil.updateTemplate(updates, currentTemplate, {
        sections: { [sectionId]: null }
      })
    );

  //
  // Admin Edit Mode
  //

  const enableAdminEditMode = (currentUser: userModel) => {
    setIsAdminEditModeEnabled(true);
    setUpdateOption({
      adminEdit: true,
      adminFullName: getUserFullname(currentUser),
      adminId: currentUser.id
    });
  };

  // handle inspection publishing errors
  const handleErrorResponse = (err: BaseError) => {
    let errorMessage =
      'Unexpected error. Please try again, or contact an admin.';
    if (err instanceof ErrorBadRequest) {
      errorMessage = 'Bad request, please contact an admin';
    } else if (err instanceof ErrorConflictingRequest) {
      errorMessage =
        'Please wait to update inspection until its’ PDF report has finished generating';
    } else if (
      err instanceof ErrorUnauthorized ||
      err instanceof ErrorForbidden
    ) {
      errorMessage =
        // eslint-disable-next-line max-len
        'Unauthorized, please login again or confirm you have been given the necessary permissions to update this inspection';
    }

    sendNotification(errorMessage, { type: 'error' });

    const wrappedErr = Error(
      `${PREFIX} publish: failed to publish inspection: "${inspectionId}" updates: ${err}`
    );
    sendErrorReports([wrappedErr]);
  };

  const disableAdminEditMode = () => {
    setIsAdminEditModeEnabled(false);
    setUpdateOption({});
  };

  const calculateAndSetProgressValue =
    (totalBytes: number) => (uploadedBytes: number) => {
      // Add 20% for inspection publish
      const bytesForUpload = totalBytes + totalBytes * 0.2;

      const calculatedProgress = (uploadedBytes / bytesForUpload) * 100;
      setProgress(calculatedProgress);
    };

  //
  // Publishing
  //

  // upload all signature and then publish updated inspection to api
  const publish = async (
    unpublishedSignatures: Map<string, unpublishedSignatureModel[]>,
    unpublishedItemPhotos: Map<string, unpublishedPhotosModel[]>
  ) => {
    setIsPublishing(true);
    setProgress(0);

    // Create flat list of signatures & photos
    const flattenedUnpublishedSignatures = flattenMap(unpublishedSignatures);
    const flattenedUnpublishedPhotos = flattenMap(unpublishedItemPhotos);

    // Calculate all files size
    // to calculate progress
    const totalBytes = [
      ...flattenedUnpublishedSignatures,
      ...flattenedUnpublishedPhotos
    ].reduce(
      (sum: number, file: unpublishedSignatureModel | unpublishedPhotosModel) =>
        sum + file.size,
      0
    );

    const uploadedBytes = 0;
    const setProgressValue = calculateAndSetProgressValue(totalBytes);

    // Error collections
    const signatureErrors = [];
    const photosErrors = [];

    // Uploading signatures
    const { successful: signatureUploads, errors: signatureUploadErrors } =
      await publishSignatures.uploadSignatures(
        inspectionId,
        flattenedUnpublishedSignatures,
        uploadBase64FileToStorage,
        uploadedBytes,
        setProgressValue
      );

    // Save signature URL's to unpublished updates
    applyLatestUpdates(
      publishSignatures.addSignatureUrls(
        updates,
        currentTemplate,
        updateOption,
        signatureUploads
      )
    );

    // Remove all uploaded signatures from local database
    const { errors: signatureRemoveErrors } =
      await publishSignatures.removePublished(signatureUploads);

    // Combine all signature errors
    signatureErrors.push(...signatureUploadErrors, ...signatureRemoveErrors);

    // Upload photos
    const { successful: photoUploads, errors: photoUploadErrors } =
      await publishPhotos.uploadPhotos(
        inspectionId,
        flattenedUnpublishedPhotos,
        uploadedBytes,
        setProgressValue
      );

    // Save photo's data to unpublished updates
    applyLatestUpdates(
      publishPhotos.addPhotoData(
        updates,
        currentTemplate,
        updateOption,
        photoUploads
      )
    );

    // Remove all uploaded photo from local database
    const { errors: photoRemoveErrors } = await publishPhotos.removePublished(
      photoUploads
    );

    // Combine all photo errors
    photosErrors.push(...photoUploadErrors, ...photoRemoveErrors);

    // Publish inspection updates
    // NOTE: should not fail gracefully
    try {
      await inspectionsApi.updateInspectionTemplate(inspectionId, updates);
    } catch (err) {
      setIsPublishing(false);
      handleErrorResponse(err);
    }

    // Combine all errors
    const errors = [...signatureErrors, ...photosErrors];

    // User signature error notification
    if (signatureErrors.length > 0) {
      sendNotification(
        'Some signatures failed to publish, please check your internet connection and try again',
        { type: 'error' }
      );
    }

    // User photo error notification
    if (photosErrors.length > 0) {
      sendNotification(
        'Some inspection item photos failed to publish, please check your internet connection and try again',
        { type: 'error' }
      );
    }

    // Send system errors
    if (errors.length > 0) {
      sendErrorReports(errors);
    } else {
      sendNotification('Inspection published successfully', {
        type: 'success'
      });
    }

    setProgress(100);
    // Setting loader value after 100 ms
    // so user can see progress bar moved to 100%
    setTimeout(() => setIsPublishing(false), 200);

    // Resetting progress
    setTimeout(() => setProgress(0), 300);
  };

  return {
    isPublishing,
    isAdminEditModeEnabled,
    hasUpdates,
    updates,
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue,
    addSection,
    removeSection,
    setItemIsNA,
    updateInspectorNotes,
    enableAdminEditMode,
    disableAdminEditMode,
    destroyUpdates,
    publish,
    publishProgress: progress
  };
}

// Check if updates contain any
// relevant user update data
function isInspectionTemplateUpdated(updates?: inspectionTemplateUpdateModel) {
  if (!updates) return false;

  return (
    Object.keys(updates.sections || {}).length > 0 ||
    Object.keys(updates.items || {}).length > 0
  );
}

// send error reports to API
// TODO: Refactor to multi-error reports
function sendErrorReports(errors: Error[]) {
  errors.forEach((err) => {
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(err);
  });
}

// Deep clone an object
function clone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

// Convert a map to a flat array
function flattenMap(map: Map<string, any[]>): any[] {
  const result = [];
  map.forEach((items) => {
    result.push(...items);
  });
  return result;
}

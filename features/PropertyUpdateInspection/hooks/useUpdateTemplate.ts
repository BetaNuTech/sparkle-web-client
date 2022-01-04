import { useState } from 'react';
import useStorage from '../../../common/hooks/useStorage';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import unpublishedTemplateUpdatesModel from '../../../common/models/inspections/unpublishedTemplateUpdate';
import inspUtil from '../../../common/utils/inspection';
import * as objectHelper from '../../../common/utils/object';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';
import errorReports from '../../../common/services/api/errorReports';
import inspectionsApi from '../../../common/services/api/inspections';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';
import publishSignatures from '../utils/publishSignatures';

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
  publish(signatures: Map<string, unpublishedSignatureModel[]>): Promise<void>;
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
  const [updates, setUpdates] = useState(
    previousUpdates ? clone(previousUpdates.template || {}) : {}
  );

  //
  // Update Management
  //

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

  const disableAdminEditMode = () => {
    setIsAdminEditModeEnabled(false);
    setUpdateOption({});
  };

  //
  // Publishing
  //

  // upload all signature and then publish updated inspection to api
  const publish = async (
    unpublishedSignatures: Map<string, unpublishedSignatureModel[]>
  ) => {
    setIsPublishing(true);

    // Create flat list of all signatures
    const flattenedUnpublishedSignatures = [];
    unpublishedSignatures.forEach((signatures) => {
      flattenedUnpublishedSignatures.push(...signatures);
    });

    // Error collections
    const signatureErrors = [];

    // Upload signatures
    const { successful: signatureUploads, errors: signatureUploadErrors } =
      await publishSignatures.upload(
        inspectionId,
        flattenedUnpublishedSignatures,
        uploadBase64FileToStorage
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

    //
    // TODO Upload item photos
    //

    // Publish inspection updates
    // NOTE: should not fail gracefully
    try {
      await inspectionsApi.updateInspectionTemplate(inspectionId, updates);
    } catch (err) {
      setIsPublishing(false);
      const wrappedErr = Error(
        `${PREFIX} publish: failed to publish inspection: "${inspectionId}" updates: ${err}`
      );
      sendErrorReports([wrappedErr]);
      sendNotification(
        'Unexpected error. Please try again, or contact an admin.',
        { type: 'error' }
      );
      throw wrappedErr;
    }

    // Combine all errors
    const errors = [...signatureErrors];

    // User signature error notification
    if (signatureErrors.length > 0) {
      sendNotification(
        'Some signatures failed to publish, please check your internet connection and try again',
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

    setIsPublishing(false);
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
    publish
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

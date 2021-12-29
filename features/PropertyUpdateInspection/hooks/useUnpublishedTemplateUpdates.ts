import { useEffect, useState } from 'react';
import * as objectHelper from '../../../common/utils/object';
import errorReports from '../../../common/services/api/errorReports';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';

const PREFIX =
  'features: PropertyUpdateInspection: hooks: useUnpublishedTemplate:';

interface Result {
  status: string;
  data: inspectionTemplateUpdateModel;
  hasUpdates: boolean;
  setLatestTemplateUpdates(
    latestTemplate: inspectionTemplateUpdateModel
  ): inspectionTemplateUpdateModel;
}
type userNotifications = (message: string, options?: any) => any;

// Hooks save and get unpublished inspection template state
// and updating that state
export default function useUnpublishedTemplate(
  inspectionId: string,
  propertyId: string,
  sendNotification: userNotifications,
  srcUpdatedTemplate = {} as inspectionTemplateUpdateModel
): Result {
  const [hasUpdates, setHasUpdates] = useState(false);
  const [unpublishedTemplateUpdateId, setUnpublishedTemplateUpdateId] =
    useState(null);
  const [updatedTemplate, setUnpublishedTemplateUpdates] =
    useState(srcUpdatedTemplate);

  // Set if local state has diverged
  // from the original/remote state
  function isInspectionTemplateUpdated(updated: inspectionTemplateUpdateModel) {
    const hasItemUpdates = Boolean(updated.items);
    const hasSectionUpdates = Boolean(updated.sections);
    return Boolean(hasItemUpdates || hasSectionUpdates);
  }

  // Set latest inpsection updates
  // and save them locally
  function setLatestTemplateUpdates(
    latestTemplate: inspectionTemplateUpdateModel
  ): inspectionTemplateUpdateModel {
    // Updated template has publishable state
    setHasUpdates(isInspectionTemplateUpdated(latestTemplate));
    // Setup updated template for merging
    updatedTemplate.items = updatedTemplate.items || {};
    updatedTemplate.sections = updatedTemplate.sections || {};

    // Merge latest
    objectHelper.replaceContent(
      updatedTemplate.items,
      latestTemplate.items || {}
    );
    objectHelper.replaceContent(
      updatedTemplate.sections,
      latestTemplate.sections || {}
    );

    // Cleanup removals
    if (!updatedTemplate.items) delete updatedTemplate.items;
    if (!updatedTemplate.sections) delete updatedTemplate.sections;

    // Set latest template updates
    setUnpublishedTemplateUpdates({ ...updatedTemplate });
    saveUnpublishedUpdatedTemplate({ ...updatedTemplate });
    return latestTemplate;
  }

  const handleErrorResponse = (err) => {
    sendNotification(
      'Unexpected error. Please try again, or contact an admin.',
      {
        type: 'error'
      }
    );
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${err}`);
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  // Lookup any local inspection updates
  const getUnpublishedTemplateUpdates = async () => {
    setUnpublishedTemplateUpdateId(null);
    setHasUpdates(false);
    let result = null;
    if (inspectionId) {
      try {
        // eslint-disable-next-line import/no-named-as-default-member
        result = await inspectionTemplateUpdates.getRecord(inspectionId);
      } catch (err) {
        handleErrorResponse(err);
      }
    }
    if (result) {
      // should not update update template updates state if data is same
      const stringifiedUpdatedTemplate = JSON.stringify(updatedTemplate);
      const stringifiedResultUpdatedTemplate = JSON.stringify(result.template);

      setHasUpdates(isInspectionTemplateUpdated(result.template));
      setUnpublishedTemplateUpdateId(result.id);
      if (stringifiedUpdatedTemplate !== stringifiedResultUpdatedTemplate) {
        setUnpublishedTemplateUpdates({ ...result.template });
      }
    }
  };

  // Create a new local template
  // updates record
  const addTemplateRecord = async (
    templateUpdates: inspectionTemplateUpdateModel
  ) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      const resultId = await inspectionTemplateUpdates.createRecord(
        templateUpdates,
        propertyId,
        inspectionId
      );
      setUnpublishedTemplateUpdateId(resultId);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  // Update an existing local template
  // updates record
  const updateTemplateRecord = async (
    templateUpdates: inspectionTemplateUpdateModel
  ) => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionTemplateUpdates.updateRecord(
        templateUpdates,
        unpublishedTemplateUpdateId
      );
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const deleteTemplateRecord = async () => {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionTemplateUpdates.deleteRecord(unpublishedTemplateUpdateId);
      setUnpublishedTemplateUpdateId(null);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const saveUnpublishedUpdatedTemplate = (
    templateUpdates: inspectionTemplateUpdateModel
  ) => {
    const hasSections = Object.keys(templateUpdates.sections || {}).length > 0;
    const hasItems = Object.keys(templateUpdates.items || {}).length > 0;

    if (hasSections || hasItems) {
      // update record if it exist in local db
      if (unpublishedTemplateUpdateId) {
        updateTemplateRecord(templateUpdates);
      } else {
        // create record in localDB and set record id for record reference
        addTemplateRecord(templateUpdates);
      }
    } else if (unpublishedTemplateUpdateId) {
      // remove templdate update from localDB
      deleteTemplateRecord();
    }
  };

  useEffect(() => {
    getUnpublishedTemplateUpdates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId]);

  return {
    status: 'success',
    data: updatedTemplate,
    hasUpdates,
    setLatestTemplateUpdates
  };
}

import { useState } from 'react';
import * as objectHelper from '../../../common/utils/object';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';

interface Result {
  status: string;
  data: inspectionTemplateUpdateModel;
  hasUpdates: boolean;
  setLatestTemplateUpdates(
    latestTemplate: inspectionTemplateUpdateModel
  ): inspectionTemplateUpdateModel;
}

// Hooks finding unpublished inspection state
// and updating that state
export default function useUnpublishedTemplate(
  srcUpdatedTemplate = {} as inspectionTemplateUpdateModel
): Result {
  // TODO lookup from local DB
  // and set if user has prior updates
  const [status] = useState('success');
  const [hasUpdates, setHasUpdates] = useState(false);
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
  // TODO save to local database
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
    return latestTemplate;
  }

  return {
    status,
    data: updatedTemplate,
    hasUpdates,
    setLatestTemplateUpdates
  };
}

import { useState, useEffect } from 'react';
import templateUtils from '../../../common/utils/template';
import errorReports from '../../../common/services/api/errorReports';
import templateUpdates from '../../../common/services/indexedDB/templateUpdates';
import TemplateModal from '../../../common/models/template';
import * as objectHelper from '../../../common/utils/object';
import deepClone from '../../../__tests__/helpers/deepClone';

const PREFIX = 'features: TemplateEdit: hooks: useUpdateTemplate:';

interface useUpdateTemplateResult {
  updates: TemplateModal;
  hasUpdates: boolean;
  updateName(name: string): TemplateModal;
  updateDescription(description: string): TemplateModal;
  updateCategory(category: string): TemplateModal;
  updateTrackDeficientItems(trackDeficientItems: boolean): TemplateModal;
  updateRequireDeficientItemNoteAndPhoto(
    requireDeficientItemNoteAndPhoto: boolean
  ): TemplateModal;
  addSection(): TemplateModal;
  updateSectionTitle(sectionId: string, title: string): TemplateModal;
  updateSectionType(sectionId: string, type: string): TemplateModal;
  updateSectionIndex(sectionId: string, index: number): TemplateModal;
  removeSection(sectionId: string): TemplateModal;
  addItem(sectionId: string, itemType: string): TemplateModal;
  updateItemType(itemId: string, itemType: string): TemplateModal;
  updateItemMainInputType(itemId: string, mainInputType: string): TemplateModal;
  updateItemTitle(itemId: string, title: string): TemplateModal;
  updatePhotosValue(itemId: string, photos: boolean): TemplateModal;
  updateNotesValue(itemId: string, notes: boolean): TemplateModal;
  updateScore(itemId: string, scoreKey: string, score: number): TemplateModal;
  updateItemIndex(itemId: string, index: number): TemplateModal;
}

export default function useUpdateTemplate(
  templateId: string,
  previousUpdates: TemplateModal,
  currentItem: TemplateModal
): useUpdateTemplateResult {
  const [hasUpdates, setHasUpdates] = useState(
    isTemplateUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState(
    previousUpdates || ({} as TemplateModal)
  );

  //
  // Update Management
  //

  // Create, update, or remove a local
  // template update record based on
  // user's updates
  const persistUnpublishedUpdates = async (data: TemplateModal) => {
    const hasAnyUpdates = isTemplateUpdated(data);
    try {
      if (hasAnyUpdates) {
        // Create or add local template updates record
        await templateUpdates.upsertRecord(templateId, {
          ...data
        });
      } else {
        // Remove unneeded/empty local template updates record
        await templateUpdates.deleteRecord(templateId);
      }
    } catch (err) {
      sendErrorReports([Error(`${PREFIX} persistUnpublishedUpdates: ${err}`)]);
    }
  };

  // Set latest template updates in memory
  const applyLatestUpdates = (latestUpdates: TemplateModal): TemplateModal => {
    // Updated item has publishable state
    setHasUpdates(isTemplateUpdated(latestUpdates));

    // In memory save
    objectHelper.replaceContent(updates, latestUpdates || {});
    setUpdates({ ...updates });

    // Local database save
    persistUnpublishedUpdates(updates);

    return latestUpdates;
  };

  // Apply local updates
  // to global updates once
  // NOTE: use effect fixes inconsistent
  //       rendering issues with history
  useEffect(() => {
    if (previousUpdates) {
      applyLatestUpdates(deepClone(previousUpdates || {}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${previousUpdates}`]);

  const updateName = (name: string): TemplateModal =>
    applyLatestUpdates(templateUtils.update(updates, currentItem, { name }));

  const updateDescription = (description: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, { description })
    );

  const updateCategory = (category: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, { category })
    );

  const updateTrackDeficientItems = (
    trackDeficientItems: boolean
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, { trackDeficientItems })
    );

  const updateRequireDeficientItemNoteAndPhoto = (
    requireDeficientItemNoteAndPhoto: boolean
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        requireDeficientItemNoteAndPhoto
      })
    );

  const addSection = (): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        sections: { new: true }
      })
    );

  const updateSectionTitle = (
    sectionId: string,
    title: string
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        sections: { [sectionId]: { title } }
      })
    );

  const updateSectionType = (
    sectionId: string,
    section_type: string // eslint-disable-line camelcase
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        sections: { [sectionId]: { section_type } }
      })
    );

  const updateSectionIndex = (
    sectionId: string,
    index: number
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        sections: { [sectionId]: { index } }
      })
    );

  const removeSection = (sectionId: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        sections: { [sectionId]: null }
      })
    );

  const addItem = (sectionId: string, itemType: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { new: { sectionId, itemType } }
      })
    );
  const updateItemType = (itemId: string, itemType: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { itemType } }
      })
    );

  const updateItemMainInputType = (
    itemId: string,
    mainInputType: string
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { mainInputType } }
      })
    );

  const updateItemTitle = (itemId: string, title: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { title } }
      })
    );

  const updatePhotosValue = (itemId: string, photos: boolean): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { photos } }
      })
    );

  const updateNotesValue = (itemId: string, notes: boolean): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { notes } }
      })
    );

  const updateScore = (
    itemId: string,
    scoreKey: string,
    score: number
  ): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { [scoreKey]: score } }
      })
    );

  const updateItemIndex = (itemId: string, index: number): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: { index } }
      })
    );

  return {
    updates,
    hasUpdates,
    updateName,
    updateDescription,
    updateCategory,
    updateTrackDeficientItems,
    updateRequireDeficientItemNoteAndPhoto,
    addSection,
    updateSectionTitle,
    updateSectionType,
    updateSectionIndex,
    removeSection,
    addItem,
    updateItemType,
    updateItemMainInputType,
    updateItemTitle,
    updatePhotosValue,
    updateNotesValue,
    updateScore,
    updateItemIndex
  };
}

// Check if updates contain any
// relevant user update data
function isTemplateUpdated(updates?: any) {
  return Object.keys(updates || {}).length > 0;
}

function sendErrorReports(errors: Error[]) {
  errors.forEach((err) => {
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(err);
  });
}

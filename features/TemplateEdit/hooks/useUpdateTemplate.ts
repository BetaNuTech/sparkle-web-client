import { useState, useEffect } from 'react';
import templateUtils from '../../../common/utils/template';
import errorReports from '../../../common/services/api/errorReports';
import templateUpdates from '../../../common/services/indexedDB/templateUpdates';
import templatesApi from '../../../common/services/api/templates';
import TemplateModal from '../../../common/models/template';
import * as objectHelper from '../../../common/utils/object';
import deepClone from '../../../__tests__/helpers/deepClone';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';

const PREFIX = 'features: TemplateEdit: hooks: useUpdateTemplate:';
export const USER_NOTIFICATIONS = {
  badRequest:
    'Template updates are invalid, please correct any template issues or contact an admin',
  unpermissioned:
    'You do not have permission to make these updates, please login again or contact an admin',
  generic: 'Failed to update template, please try again'
};

type UserNotifications = (message: string, options?: any) => any;
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
  removeItem(itemId: string): TemplateModal;
  onSelectItems(sectionId: string, itemId: string): void;
  onDeleteItems(sectionId: string): void;
  selectedItems: Record<string, string[]>;
  selectedSections: string[];
  onSelectSections(sectionId: string): void;
  setSelectedSections(selections: string[]): void;
  deletingSection: string;
  setDeletingSection(sectionId: string): void;
  isVisibleSectionDeletePrompt: boolean;
  setIsVisibleSectionDeletePrompt(isVisible: boolean): void;
  onConfirmDeleteSections(targetIds: string[]): void;
  onCancelDeleteSection(): void;
  updateTemplate(): void;
  isLoading: boolean;
}

export default function useUpdateTemplate(
  templateId: string,
  previousUpdates: TemplateModal,
  currentItem: TemplateModal,
  sendNotification: UserNotifications
): useUpdateTemplateResult {
  const [hasUpdates, setHasUpdates] = useState(
    isTemplateUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState(
    previousUpdates || ({} as TemplateModal)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedSections, setSelectedSections] = useState([]);
  const [deletingSection, setDeletingSection] = useState(null);
  const [isVisibleSectionDeletePrompt, setIsVisibleSectionDeletePrompt] =
    useState(false);

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

  const removeItem = (itemId: string): TemplateModal =>
    applyLatestUpdates(
      templateUtils.update(updates, currentItem, {
        items: { [itemId]: null }
      })
    );

  const onSelectSections = (sectionId: string) => {
    const isRemoving = selectedSections.includes(sectionId);
    if (isRemoving) {
      setSelectedSections(
        [...selectedSections].filter((id) => id !== sectionId)
      );
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const onConfirmDeleteSections = (targetIds: string[]) => {
    targetIds.forEach((id) => {
      removeSection(id);
    });

    setDeletingSection(null); // Clear single delete section
    setSelectedSections([
      // Remove all deleted sections from selections
      ...selectedSections.filter((id) => targetIds.includes(id) === false)
    ]);
    setIsVisibleSectionDeletePrompt(false);
  };

  const onCancelDeleteSection = () => {
    setDeletingSection(null);
    setIsVisibleSectionDeletePrompt(false);
  };

  const onSelectItems = (sectionId: string, itemId: string) => {
    const items = selectedItems[sectionId] || [];
    const isRemoving = items.includes(itemId);
    if (isRemoving) {
      setSelectedItems({
        ...selectedItems,
        [sectionId]: [...items].filter((id) => id !== itemId)
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [sectionId]: [...items, itemId]
      });
    }
  };

  const onDeleteItems = (sectionId: string) => {
    const items = selectedItems[sectionId];
    items.forEach((id: string) => {
      removeItem(id);
    });
    setSelectedItems({
      ...selectedItems,
      [sectionId]: []
    });
  };

  const handleErrorResponse = (error: BaseError) => {
    if (error instanceof ErrorBadRequest) {
      sendNotification(USER_NOTIFICATIONS.badRequest, {
        type: 'error'
      });
    } else if (
      error instanceof ErrorForbidden ||
      error instanceof ErrorUnauthorized
    ) {
      sendNotification(USER_NOTIFICATIONS.unpermissioned, {
        type: 'error'
      });
    } else {
      sendNotification(USER_NOTIFICATIONS.generic, {
        type: 'error'
      });
    }

    // Log issue and send error report
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${error}`);

    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const updateTemplate = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await templatesApi.updateRecord(templateId, updates);
      sendNotification('Template updated successfully', {
        type: 'success'
      });
      applyLatestUpdates({} as TemplateModal);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

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
    updateItemIndex,
    removeItem,
    onSelectItems,
    onDeleteItems,
    selectedItems,
    selectedSections,
    onSelectSections,
    setSelectedSections,
    deletingSection,
    setDeletingSection,
    isVisibleSectionDeletePrompt,
    setIsVisibleSectionDeletePrompt,
    onConfirmDeleteSections,
    onCancelDeleteSection,
    updateTemplate,
    isLoading
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

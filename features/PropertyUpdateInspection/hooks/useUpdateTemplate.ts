import { useState } from 'react';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspUtil from '../../../common/utils/inspection';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';

interface useItemUpdateResult {
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
  isAdminEditModeEnabled: boolean;
}

export default function useInspectionItemUpdate(
  updatedTemplate: inspectionTemplateUpdateModel,
  currentTemplate: inspectionTemplateUpdateModel
): useItemUpdateResult {
  const [isAdminEditModeEnabled, setIsAdminEditModeEnabled] = useState(false);
  const [updateOption, setUpdateOption] = useState({});

  // merge item data with previous state for unsaved template item
  const mergeItem = (result: inspectionTemplateUpdateModel, itemId: string) => {
    const items = updatedTemplate?.items || {};
    const updatedItem = items[itemId] || {};
    const resultItem = (result?.items || {})[itemId] || null;
    if (resultItem) {
      const mergedItem = resultItem
        ? {
            ...(updatedItem || {}),
            ...resultItem
          }
        : null;
      result.items[itemId] = mergedItem;
    }
    return result;
  };

  // User selects new main input option
  const updateMainInputSelection = (
    itemId: string,
    selectionIndex: number
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(
      updatedTemplate,
      currentTemplate,
      {
        items: { [itemId]: { mainInputSelection: selectionIndex } }
      },
      updateOption
    );

  const updateTextInputValue = (
    itemId: string,
    textInputValue: string
  ): inspectionTemplateUpdateModel => {
    const result = inspUtil.updateTemplate(
      updatedTemplate,
      currentTemplate,
      {
        items: { [itemId]: { textInputValue } }
      },
      updateOption
    );

    const mergedResult = mergeItem(result, itemId);
    return mergedResult;
  };

  const updateMainInputNotes = (
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(
      updatedTemplate,
      currentTemplate,
      {
        items: { [itemId]: { mainInputNotes: notes } }
      },
      updateOption
    );

  const updateInspectorNotes = (
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(
      updatedTemplate,
      currentTemplate,
      {
        items: { [itemId]: { inspectorNotes: notes } }
      },
      updateOption
    );

  const setItemIsNA = (
    itemId: string,
    isItemNA: boolean
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(
      updatedTemplate,
      currentTemplate,
      {
        items: { [itemId]: { isItemNA } }
      },
      updateOption
    );

  const addSection = (sectionId: string): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      sections: { new: { cloneOf: sectionId } }
    });

  const removeSection = (sectionId: string): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      sections: { [sectionId]: null }
    });

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

  return {
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue,
    addSection,
    removeSection,
    setItemIsNA,
    updateInspectorNotes,
    enableAdminEditMode,
    disableAdminEditMode,
    isAdminEditModeEnabled
  };
}

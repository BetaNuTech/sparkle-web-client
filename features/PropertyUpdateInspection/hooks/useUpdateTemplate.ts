import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspUtil from '../../../common/utils/inspection';

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
  removeSection(sectionId: string): inspectionTemplateUpdateModel;
}

export default function useInspectionItemUpdate(
  updatedTemplate: inspectionTemplateUpdateModel,
  currentTemplate: inspectionTemplateUpdateModel
): useItemUpdateResult {
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
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { mainInputSelection: selectionIndex } }
    });

  const updateTextInputValue = (
    itemId: string,
    textInputValue: string
  ): inspectionTemplateUpdateModel => {
    const result = inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { textInputValue } }
    });

    const mergedResult = mergeItem(result, itemId);
    return mergedResult;
  };

  const updateMainInputNotes = (
    itemId: string,
    notes: string
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { mainInputNotes: notes } }
    });

  const setItemIsNA = (
    itemId: string,
    isItemNA: boolean
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { isItemNA } }
    });

  const addSection = (sectionId: string): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      sections: { new: { cloneOf: sectionId } }
    });

  const removeSection = (sectionId: string): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      sections: { [sectionId]: null }
    });

  return {
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue,
    addSection,
    removeSection,
    setItemIsNA
  };
}

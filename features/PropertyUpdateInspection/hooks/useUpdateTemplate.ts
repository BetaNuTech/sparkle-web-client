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
  ): inspectionTemplateUpdateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { textInputValue } }
    });

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

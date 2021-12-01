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

  return {
    updateMainInputSelection,
    updateMainInputNotes,
    updateTextInputValue
  };
}

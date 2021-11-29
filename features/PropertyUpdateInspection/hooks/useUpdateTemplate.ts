import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspUtil from '../../../common/utils/inspection';

interface useItemUpdateResult {
  updateMainInputSelection(
    itemId: string,
    selectionIndex: number
  ): inspectionTemplateModel;
  updateMainInputNotes(
    itemId: string,
    notes: string
  ): inspectionTemplateModel;
}

export default function useInspectionItemUpdate(
  updatedTemplate: inspectionTemplateModel,
  currentTemplate: inspectionTemplateModel
): useItemUpdateResult {
  // User selects new main input option
  const updateMainInputSelection = (
    itemId: string,
    selectionIndex: number
  ): inspectionTemplateModel =>
    inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
      items: { [itemId]: { mainInputSelection: selectionIndex } }
    });

  const updateMainInputNotes = (
      itemId: string,
      notes: string
    ): inspectionTemplateModel =>
      inspUtil.updateTemplate(updatedTemplate, currentTemplate, {
        items: { [itemId]: { mainInputNotes: notes } }
      });

  return {
    updateMainInputSelection,
    updateMainInputNotes
  };
}

import inspectionTemplateModel from '../../../common/models/inspectionTemplate';
import inspUtil from '../../../common/utils/inspection';

interface useItemUpdateResult {
  updateMainInputSelection(
    itemId: string,
    selectionIndex: number
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

  return {
    updateMainInputSelection
  };
}

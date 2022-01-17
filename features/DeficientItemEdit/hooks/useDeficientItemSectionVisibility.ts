import deficientItemModel from '../../../common/models/deficientItem';

type DeficientItemSectionVisibilityResult = {
  showNotes: boolean;
};

// Hooks for Deficient Item
export default function useDeficientItemSectionVisibility(
  deficientItem: deficientItemModel
): DeficientItemSectionVisibilityResult {
  const showNotes = Boolean(deficientItem.itemInspectorNotes);

  return {
    showNotes
  };
}

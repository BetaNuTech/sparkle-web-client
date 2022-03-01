import { useEffect, useState } from 'react';
import deepmerge from '../../../common/utils/deepmerge';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import utilArray from '../../../common/utils/array';
import inspectionConfig from '../../../config/inspections';
import useSearching from '../../../common/hooks/useSearching';

const DEFICIENT_LIST_ELIGIBLE = inspectionConfig.deficientListEligible;

interface Result {
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  inspectionItems: inspectionTemplateItemModel[];
  inspectionItemDeficientIds: string[];
  searchParam: string;
  onSearchKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
  onClearSearch(): void;
}

// Hooks for filtering inspections list
export default function useInspectionItems(
  updatedTemplate: inspectionTemplateUpdateModel,
  currentTemplate: inspectionTemplateUpdateModel,
  requireDeficientItemNoteAndPhoto: boolean
): Result {
  const sections: Record<string, inspectionTemplateSectionModel> = deepmerge(
    currentTemplate.sections || {},
    updatedTemplate.sections || {}
  );

  // Merge current items state with local updates
  const items: Record<string, inspectionTemplateItemModel> = deepmerge(
    currentTemplate.items || {},
    updatedTemplate.items || {}
  );
  const [memo, setMemo] = useState('[]');

  const itemsList = Object.keys(items).map((id) => ({
    id,
    ...items[id]
  }));

  // using useSearching hook for searching
  // as we have inspection items array
  // and its grouping already here
  const { onSearchKeyDown, filteredItems, searchParam, onClearSearch } =
    useSearching(itemsList, ['title']);

  const filteredInspectionItems = filteredItems.map(
    (itm) => itm as inspectionTemplateItemModel
  );

  // Grouping of section by section id
  const sectionItems = utilArray.groupBy<string, inspectionTemplateItemModel>(
    filteredInspectionItems,
    (item) => item.sectionId
  );

  // Sorting the group array by index
  sectionItems.forEach((item) =>
    item.sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex)
  );

  const inspectionItemDeficientIds: string[] = [];

  if (requireDeficientItemNoteAndPhoto) {
    Object.keys(sections)
      .filter((sectionId) => Boolean(sections[sectionId]))
      .sort((aId, bId) => sections[aId].index - sections[bId].index)
      .map((sectionId) => sectionItems.get(sectionId)) // get section's items
      .reduce((acc, itemsSectionGroup) => {
        acc.push(...(itemsSectionGroup || []));
        return acc;
      }, [])
      .filter((item) => item.id && isItemDeficient(item))
      .map(({ id }) => id || '')
      .forEach((id) => inspectionItemDeficientIds.push(id));
  }

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sectionItems);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sectionItems,
    inspectionItems: itemsList,
    inspectionItemDeficientIds,
    searchParam,
    onSearchKeyDown,
    onClearSearch
  };
}

// Determine if item will be considered deficient
// based on the current selection
function isItemDeficient(item: inspectionTemplateItemModel) {
  const mainInputType = `${item.mainInputType || ''}`.toLowerCase();
  const deficientEligibles = DEFICIENT_LIST_ELIGIBLE[mainInputType] || [];
  return deficientEligibles[item?.mainInputSelection] || false;
}

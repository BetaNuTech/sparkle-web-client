import { useEffect, useState } from 'react';
import deepmerge from '../../../common/utils/deepmerge';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import utilArray from '../../../common/utils/array';
import inspectionConfig from '../../../config/inspections';

const DEFICIENT_LIST_ELIGIBLE = inspectionConfig.deficientListEligible;

interface Result {
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  inspectionItems: inspectionTemplateItemModel[];
  inspectionItemDeficientIds: string[];
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

  // Grouping of section by section id
  const sectionItems = utilArray.groupBy<string, inspectionTemplateItemModel>(
    itemsList,
    (item) => item.sectionId
  );

  // Sorting the group array by index
  sectionItems.forEach((item) =>
    item.sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex)
  );

  const inspectionItemDeficientIds: string[] = [];

  if (requireDeficientItemNoteAndPhoto) {
    Object.keys(sections)
      .sort((aId, bId) => sections[aId].index - sections[bId].index)
      .map((sectionId) => sectionItems.get(sectionId)) // get section's items
      .reduce((acc, itemsSectionGroup) => {
        acc.push(...itemsSectionGroup);
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
    inspectionItemDeficientIds
  };
}

// Determine if item will be considered deficient
// based on the current selection
function isItemDeficient(item: inspectionTemplateItemModel) {
  const deficientEligibles = DEFICIENT_LIST_ELIGIBLE[item?.mainInputType] || [];
  return deficientEligibles[item?.mainInputSelection] || false;
}

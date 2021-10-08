import { useEffect, useState } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import utilArray from '../../../common/utils/array';

interface useInspectionItemsResult {
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
}

// Hooks for filtering inspections list
export default function useInspectionItems(
  items: Record<string, inspectionTemplateItemModel>
): useInspectionItemsResult {
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
    sectionItems
  };
}

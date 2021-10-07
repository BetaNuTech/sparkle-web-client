import { useEffect, useState } from 'react';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';

interface useInspectionSectionsResult {
  sortedTemplateSections: Array<inspectionTemplateSectionModel>;
  collapsedSections: string[];
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
}

// Hooks for filtering inspections list
export default function useInspectionSections(
  sections: Record<string, inspectionTemplateSectionModel>
): useInspectionSectionsResult {
  const [memo, setMemo] = useState('[]');

  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);

  const sortedTemplateSections = Object.keys(sections)
    .map((id) => ({
      id,
      ...sections[id]
    }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

  const onSectionCollapseToggle = (
    section: inspectionTemplateSectionModel
  ): void => {
    const localSections = [...collapsedSections];
    if (localSections.includes(section.id)) {
      // We need to remove
      localSections.splice(localSections.indexOf(section.id), 1);
    } else {
      // We do not have means we need to push
      localSections.push(section.id);
    }
    setCollapsedSections(localSections);
  };

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sortedTemplateSections);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sortedTemplateSections,
    collapsedSections,
    onSectionCollapseToggle
  };
}

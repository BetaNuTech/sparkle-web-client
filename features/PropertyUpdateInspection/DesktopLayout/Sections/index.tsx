import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import SectionItem from '../SectionItem';

interface Props {
  propertyId: string;
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onMainInputChange(
    event: React.MouseEvent<HTMLLIElement>,
    item: inspectionTemplateItemModel,
    selectionIndex: number
  ): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  forceVisible?: boolean;
}

const Sections: FunctionComponent<Props> = ({
  propertyId,
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onMainInputChange,
  forceVisible,
  sectionItems
}) => {
  if (sections && sections.length > 0) {
    return (
      <ul data-testid="inspection-section">
        {sections.map((sectionItem, idx) => (
          <SectionItem
            propertyId={propertyId}
            key={sectionItem.id}
            section={sectionItem}
            nextSectionTitle={sections[idx + 1] && sections[idx + 1].title}
            forceVisible={forceVisible}
            collapsedSections={collapsedSections}
            onSectionCollapseToggle={onSectionCollapseToggle}
            onMainInputChange={onMainInputChange}
            sectionItems={sectionItems}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default Sections;

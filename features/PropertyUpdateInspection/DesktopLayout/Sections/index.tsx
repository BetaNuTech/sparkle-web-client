import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import SectionItem from '../SectionItem';

interface Props {
  propertyId: string;
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onInputChange(
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  forceVisible?: boolean;
  onAddSection(sectionId: string): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
}

const Sections: FunctionComponent<Props> = ({
  propertyId,
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onInputChange,
  onClickOneActionNotes,
  forceVisible,
  sectionItems,
  onAddSection,
  onItemIsNAChange
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
            onInputChange={onInputChange}
            sectionItems={sectionItems}
            onClickOneActionNotes={onClickOneActionNotes}
            onAddSection={onAddSection}
            onItemIsNAChange={onItemIsNAChange}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default Sections;

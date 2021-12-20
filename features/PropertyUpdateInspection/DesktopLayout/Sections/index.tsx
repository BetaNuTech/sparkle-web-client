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
  onAddSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onRemoveSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: inspectionTemplateItemModel): void;
  onClickSignatureInput(item: inspectionTemplateItemModel): void;
  onClickPhotos(item: inspectionTemplateItemModel): void;
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
  onRemoveSection,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos
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
            onRemoveSection={onRemoveSection}
            onItemIsNAChange={onItemIsNAChange}
            onClickAttachmentNotes={onClickAttachmentNotes}
            onClickSignatureInput={onClickSignatureInput}
            onClickPhotos={onClickPhotos}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default Sections;

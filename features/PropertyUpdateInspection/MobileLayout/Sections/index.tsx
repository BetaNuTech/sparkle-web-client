import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import styles from '../../styles.module.scss';
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
  inspectionItemsPhotos: Map<string, unPublishedPhotoDataModel[]>;
}

const Sections: FunctionComponent<Props> = ({
  propertyId,
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onInputChange,
  onClickOneActionNotes,
  sectionItems,
  forceVisible,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  inspectionItemsPhotos
}) => {
  if (!sections || !sections.length) {
    return null;
  }

  return (
    <ul className={styles.section__list} data-testid="inspection-section">
      {sections.map((sectionItem, i) => (
        <SectionItem
          propertyId={propertyId}
          key={sectionItem.id}
          section={sectionItem}
          nextSectionTitle={sections[i + 1] && sections[i + 1].title}
          forceVisible={forceVisible}
          collapsedSections={collapsedSections}
          onSectionCollapseToggle={onSectionCollapseToggle}
          onInputChange={onInputChange}
          onClickOneActionNotes={onClickOneActionNotes}
          sectionItems={sectionItems}
          onAddSection={onAddSection}
          onRemoveSection={onRemoveSection}
          onItemIsNAChange={onItemIsNAChange}
          onClickAttachmentNotes={onClickAttachmentNotes}
          onClickSignatureInput={onClickSignatureInput}
          onClickPhotos={onClickPhotos}
          inspectionItemsPhotos={inspectionItemsPhotos}
        />
      ))}
    </ul>
  );
};

export default Sections;

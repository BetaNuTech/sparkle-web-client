import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import Group from './Group';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import styles from '../styles.module.scss';

interface Props {
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
  inspectionItemsSignature: Map<string, unpublishedSignatureModel[]>;
  canEdit: boolean;
  isMobile: boolean;
  isIncompleteRevealed: boolean;
  completedItems: inspectionTemplateItemModel[];
  requireDeficientItemNoteAndPhoto: boolean;
  inspectionItemDeficientIds: string[];
}

const Sections: FunctionComponent<Props> = ({
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
  onClickPhotos,
  inspectionItemsPhotos,
  inspectionItemsSignature,
  canEdit,
  isMobile,
  isIncompleteRevealed,
  completedItems,
  requireDeficientItemNoteAndPhoto,
  inspectionItemDeficientIds
}) => {
  if (!sections || !sections.length) {
    return <></>;
  }

  return (
    <ul data-testid="inspection-section" className={styles.section}>
      {sections.map((sectionItem, index) => (
        <Group
          key={sectionItem.id}
          section={sectionItem}
          nextSectionTitle={sections[index + 1] && sections[index + 1].title}
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
          inspectionItemsPhotos={inspectionItemsPhotos}
          inspectionItemsSignature={inspectionItemsSignature}
          canEdit={canEdit}
          isMobile={isMobile}
          isIncompleteRevealed={isIncompleteRevealed}
          completedItems={completedItems}
          requireDeficientItemNoteAndPhoto={requireDeficientItemNoteAndPhoto}
          inspectionItemDeficientIds={inspectionItemDeficientIds}
        />
      ))}
    </ul>
  );
};

export default Sections;

import { FunctionComponent, MouseEvent, ChangeEvent } from 'react';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import InspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import UnpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import styles from '../styles.module.scss';
import Group from './Group';

interface Props {
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onMainInputChange?(
    event: MouseEvent<HTMLLIElement>,
    item: InspectionTemplateItemModel,
    value: number
  ): void;
  onTextInputChange?(
    event: ChangeEvent<HTMLInputElement>,
    item: InspectionTemplateItemModel,
    value: string
  ): void;
  onClickOneActionNotes(item: InspectionTemplateItemModel): void;
  sectionItems: Map<string, InspectionTemplateItemModel[]>;
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
  onClickAttachmentNotes(item: InspectionTemplateItemModel): void;
  onClickSignatureInput(item: InspectionTemplateItemModel): void;
  onClickPhotos(item: InspectionTemplateItemModel): void;
  inspectionItemsPhotos: Map<string, UnPublishedPhotoDataModel[]>;
  inspectionItemsSignature: Map<string, UnpublishedSignatureModel[]>;
  canEdit: boolean;
  isMobile: boolean;
  isIncompleteRevealed: boolean;
  completedItems: InspectionTemplateItemModel[];
  requireDeficientItemNoteAndPhoto: boolean;
  inspectionItemDeficientIds: string[];
}

const Sections: FunctionComponent<Props> = ({
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onMainInputChange,
  onTextInputChange,
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
          onMainInputChange={onMainInputChange}
          onTextInputChange={onTextInputChange}
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

import clsx from 'clsx';
import { FunctionComponent, useMemo, MouseEvent, ChangeEvent } from 'react';
import InspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import InspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import UnpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';
import Header from './Header';
import Item from './Item';
import ItemSwipable from './ItemSwipable';
import styles from './styles.module.scss';

interface Props {
  section: InspectionTemplateSectionModel;
  nextSectionTitle: string;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: InspectionTemplateSectionModel): void;
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
  forceVisible: boolean;
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

const Group: FunctionComponent<Props> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  sectionItems,
  forceVisible,
  onSectionCollapseToggle,
  onMainInputChange,
  onTextInputChange,
  onClickOneActionNotes,
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
  inspectionItemDeficientIds
}) => {
  const listItems = useMemo(
    () => sectionItems.get(section.id) || [],
    [sectionItems, section.id]
  );
  const toggleCollapse = (evt: MouseEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLElement;
    if (target.closest('li') === evt.currentTarget) {
      onSectionCollapseToggle(section);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={clsx(isMobile ? styles.container : styles['container--grid'])}
      onClick={toggleCollapse}
      data-testid="section-list-item"
    >
      <Header
        collapsedSections={collapsedSections}
        section={section}
        nextSectionTitle={nextSectionTitle}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        canEdit={canEdit}
        isMobile={isMobile}
      />
      <ul className={clsx(collapsedSections.includes(section.id) && '-d-none')}>
        {listItems.map((item) =>
          isMobile ? (
            <ItemSwipable
              key={item.id}
              item={item}
              forceVisible={forceVisible}
              onMainInputChange={onMainInputChange}
              onTextInputChange={onTextInputChange}
              onClickOneActionNotes={onClickOneActionNotes}
              onItemIsNAChange={onItemIsNAChange}
              onClickAttachmentNotes={onClickAttachmentNotes}
              onClickSignatureInput={onClickSignatureInput}
              onClickPhotos={onClickPhotos}
              inspectionItemsPhotos={inspectionItemsPhotos}
              canEdit={canEdit}
              inspectionItemsSignature={inspectionItemsSignature}
              completedItems={completedItems}
              isIncompleteRevealed={isIncompleteRevealed}
              isItemDeficient={inspectionItemDeficientIds.indexOf(item.id) > -1}
            />
          ) : (
            <Item
              key={item.id}
              item={item}
              forceVisible={forceVisible}
              onMainInputChange={onMainInputChange}
              onTextInputChange={onTextInputChange}
              onClickOneActionNotes={onClickOneActionNotes}
              onItemIsNAChange={onItemIsNAChange}
              onClickAttachmentNotes={onClickAttachmentNotes}
              onClickSignatureInput={onClickSignatureInput}
              onClickPhotos={onClickPhotos}
              inspectionItemsPhotos={inspectionItemsPhotos}
              canEdit={canEdit}
              inspectionItemsSignature={inspectionItemsSignature}
              completedItems={completedItems}
              isIncompleteRevealed={isIncompleteRevealed}
              isItemDeficient={inspectionItemDeficientIds.indexOf(item.id) > -1}
            />
          )
        )}
      </ul>
    </li>
  );
};

Group.defaultProps = {};

export default Group;

import clsx from 'clsx';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import styles from '../../styles.module.scss';
import ItemList from '../ItemList';
import ItemListSwipable from '../ItemListSwipable';
import Header from '../Header';
import unpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';
import inspectionConfig from '../../../../config/inspections';

const DEFICIENT_LIST_ELIGIBLE = inspectionConfig.deficientListEligible;

interface Props {
  section: inspectionTemplateSectionModel;
  nextSectionTitle: string;
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
}

const Group: FunctionComponent<Props> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  sectionItems,
  forceVisible,
  onSectionCollapseToggle,
  onInputChange,
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
  requireDeficientItemNoteAndPhoto
}) => {
  const [deficientItemList, setDeficientItemList] = useState([]);

  const listItems = useMemo(
    () => sectionItems.get(section.id) || [],
    [sectionItems, section.id]
  );

  // Lookup deficient items on item change
  useEffect(() => {
    // Remove animation for all previously
    // deficient items
    setDeficientItemList([]);

    // Lookup deficient ID's
    const deficientItemsIds = listItems
      .filter((item) => isItemDeficient(item, requireDeficientItemNoteAndPhoto))
      .map(({ id }) => id);

    // Set the deficient item ids after timeout
    // so animation will be applied over all
    // inspection items at the same time
    const timeoutInstance = setTimeout(() => {
      setDeficientItemList([...deficientItemsIds]);
    }, 100);

    // clearing timeout
    return () => clearTimeout(timeoutInstance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listItems]);
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={clsx(
        isMobile
          ? styles.section__list__item
          : styles['section__list__item--grid']
      )}
      onClick={(event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (target.closest('li') === event.currentTarget) {
          onSectionCollapseToggle(section);
        }
      }}
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
            <ItemListSwipable
              key={item.id}
              item={item}
              forceVisible={forceVisible}
              onInputChange={onInputChange}
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
              isItemDeficient={deficientItemList.indexOf(item.id) > -1}
            />
          ) : (
            <ItemList
              key={item.id}
              item={item}
              forceVisible={forceVisible}
              onInputChange={onInputChange}
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
              isItemDeficient={deficientItemList.indexOf(item.id) > -1}
            />
          )
        )}
      </ul>
    </li>
  );
};

function isItemDeficient(
  item: inspectionTemplateItemModel,
  requireDeficientItemNoteAndPhoto: boolean
) {
  if (!requireDeficientItemNoteAndPhoto) {
    return false;
  }

  const deficientEligibles = DEFICIENT_LIST_ELIGIBLE[item?.mainInputType] || [];

  return deficientEligibles[item?.mainInputSelection] || false;
}

Group.defaultProps = {};

export default Group;

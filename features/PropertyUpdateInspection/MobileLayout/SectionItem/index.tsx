/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { FunctionComponent } from 'react';

import DiamondIcon from '../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../public/icons/sparkle/diamond-layers.svg';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import styles from '../../styles.module.scss';
import SectionItemList from '../SectionItemList';
import unpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';

interface Props {
  propertyId: string;
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
}

const SectionItem: FunctionComponent<Props> = ({
  section,
  nextSectionTitle,
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
  inspectionItemsPhotos,
  inspectionItemsSignature
}) => {
  const listItems = sectionItems.get(section.id);
  const onListHeaderClick = (event) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.closest('li') === event.currentTarget) {
      onSectionCollapseToggle(section);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li className={styles.section__list__item} onClick={onListHeaderClick}>
      <header
        className={clsx(
          styles.section__list__item__header,
          collapsedSections.includes(section.id) &&
            styles['section__list__item__header--collapsed']
        )}
      >
        <div className={clsx(styles.section__list__item__header__content)}>
          {section.title}
          <span>
            {collapsedSections.includes(section.id) ? (
              <ChevronIcon />
            ) : section.added_multi_section ? (
              <DiamondLayersIcon />
            ) : (
              <DiamondIcon />
            )}
          </span>
        </div>
        {section.section_type === 'multi' && (
          <footer className={styles.section__list__item__footer}>
            {section.title !== nextSectionTitle && (
              <button
                className={styles.section__list__item__button}
                onClick={(event) => onAddSection(event, section.id)}
              >
                Add
              </button>
            )}
            {section.added_multi_section && (
              <button
                className={styles['section__list__item__button--red']}
                onClick={(event) => onRemoveSection(event, section.id)}
              >
                Remove
              </button>
            )}
          </footer>
        )}
      </header>
      <ul className={clsx(collapsedSections.includes(section.id) && '-d-none')}>
        {listItems.map((item) => (
          <SectionItemList
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
            inspectionItemsSignature={inspectionItemsSignature}
          />
        ))}
      </ul>
    </li>
  );
};

SectionItem.defaultProps = {};

export default SectionItem;

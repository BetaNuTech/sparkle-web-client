import clsx from 'clsx';
import { FunctionComponent } from 'react';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import styles from '../../styles.module.scss';
import SectionItemList from '../SectionItemList';
import unpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';

interface MobileLayoutTeamItemModel {
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

const SectionItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
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
  inspectionItemsSignature
}) => {
  const listItems = sectionItems.get(section.id) || [];
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={styles['section__list__item--grid']}
      onClick={(event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (target.closest('li') === event.currentTarget) {
          onSectionCollapseToggle(section);
        }
      }}
    >
      <header
        className={clsx(
          styles['section__list__item__header--grid'],
          collapsedSections.includes(section.id) &&
            styles['section__list__item__header--collapsed']
        )}
      >
        <div className={clsx(styles.section__list__item__header__content)}>
          {section.title}
          <div className={clsx(styles.section__list__item__footer)}>
            {section.section_type === 'multi' && (
              <div className={styles.section__list__item__action}>
                {section.title !== nextSectionTitle && (
                  <button
                    className={styles['section__list__item__button--line']}
                    onClick={(event) => onAddSection(event, section.id)}
                  >
                    Add
                  </button>
                )}
                {section.added_multi_section && (
                  <button
                    className={
                      styles['section__list__item__button--redOutline']
                    }
                    onClick={(event) => onRemoveSection(event, section.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
            <span>
              <ChevronIcon />
            </span>
          </div>
        </div>
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

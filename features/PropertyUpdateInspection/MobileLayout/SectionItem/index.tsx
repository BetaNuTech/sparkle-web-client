/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { FunctionComponent } from 'react';

import DiamondIcon from '../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../public/icons/sparkle/diamond-layers.svg';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import styles from '../../styles.module.scss';
import SectionItemList from '../SectionItemList';

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
  onAddSection(sectionId: string): void;
  onRemoveSection(sectionId: string): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
}

const SectionItem: FunctionComponent<Props> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  onSectionCollapseToggle,
  onInputChange,
  onClickOneActionNotes,
  sectionItems,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange
}) => {
  const listItems = sectionItems.get(section.id);
  const onListHeaderClick = (event) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.closest('li') === event.currentTarget) {
      onSectionCollapseToggle(section);
    }
  };

  const onClickAdd = (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onAddSection(sectionId);
  };
  const onClickRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveSection(sectionId);
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
                onClick={(e) => onClickAdd(e, section.id)}
              >
                Add
              </button>
            )}
            {section.added_multi_section && (
              <button
                className={styles['section__list__item__button--red']}
                onClick={(e) => onClickRemove(e, section.id)}
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
            onInputChange={onInputChange}
            onClickOneActionNotes={onClickOneActionNotes}
            onItemIsNAChange={onItemIsNAChange}
          />
        ))}
      </ul>
    </li>
  );
};

SectionItem.defaultProps = {};

export default SectionItem;

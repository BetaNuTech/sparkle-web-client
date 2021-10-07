/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { FunctionComponent } from 'react';

import DiamondIcon from '../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../public/icons/sparkle/diamond-layers.svg';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import styles from '../../styles.module.scss';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';

interface MobileLayoutTeamItemModel {
  propertyId: string;
  section: inspectionTemplateSectionModel;
  nextSectionTitle: string;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  forceVisible: boolean;
}

const SectionItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  onSectionCollapseToggle
}) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li
    className={styles.section__list__item}
    onClick={() => onSectionCollapseToggle(section)}
  >
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
      {section.added_multi_section && section.title !== nextSectionTitle && (
        <footer className={styles.section__list__item__footer}>
          <button className={styles.section__list__item__button}>Add</button>
          <button className={styles['section__list__item__button--red']}>
            Remove
          </button>
        </footer>
      )}
    </header>
  </li>
);

SectionItem.defaultProps = {};

export default SectionItem;

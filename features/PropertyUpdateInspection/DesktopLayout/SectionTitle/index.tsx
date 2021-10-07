import clsx from 'clsx';
import { FunctionComponent } from 'react';
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
    className={styles['section__list__item--grid']}
    onClick={() => onSectionCollapseToggle(section)}
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
        {section.added_multi_section && section.title !== nextSectionTitle && (
            <div className={styles.section__list__item__action}>
              <button
                className={styles['section__list__item__button--line']}
              >
                Add
              </button>
              <button
                className={styles['section__list__item__button--redOutline']}
              >
                Remove
              </button>
            </div>
          )}
          <span>
            {collapsedSections.includes(section.id) ? (
              <ChevronIcon />
            ) : (
              <ChevronIcon />
            )}
          </span>
        </div>
      </div>
    </header>
  </li>
);

SectionItem.defaultProps = {};

export default SectionItem;

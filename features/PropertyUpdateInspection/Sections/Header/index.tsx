/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import DiamondIcon from '../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../public/icons/sparkle/diamond-layers.svg';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import styles from '../../styles.module.scss';

interface Props {
  section: inspectionTemplateSectionModel;
  nextSectionTitle: string;
  collapsedSections: Array<string>;

  onAddSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onRemoveSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;

  canEdit: boolean;
  isMobile: boolean;
}

const Header: FunctionComponent<Props> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  onAddSection,
  onRemoveSection,
  canEdit,
  isMobile
}) => {
  const showSectionButtons = canEdit && section.section_type === 'multi';

  return (
    <header
      className={clsx(
        isMobile
          ? styles.section__list__item__header
          : styles['section__list__item__header--grid'],
        collapsedSections.includes(section.id) &&
          styles['section__list__item__header--collapsed']
      )}
    >
      <div className={clsx(styles.section__list__item__header__content)}>
        {section.title}
        <div className={clsx(styles.section__list__item__footer)}>
          {showSectionButtons && !isMobile && (
            <div className={styles.section__list__item__action}>
              {section.title !== nextSectionTitle && (
                <button
                  className={styles['section__list__item__button--line']}
                  onClick={(event) => onAddSection(event, section.id)}
                  data-testid="section-list-item-add-section"
                >
                  Add
                </button>
              )}
              {section.added_multi_section && (
                <button
                  className={styles['section__list__item__button--redOutline']}
                  onClick={(event) => onRemoveSection(event, section.id)}
                  data-testid="section-list-item-remove-section"
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <span>
            {collapsedSections.includes(section.id) || !isMobile ? (
              <ChevronIcon />
            ) : section.added_multi_section ? (
              <DiamondLayersIcon />
            ) : (
              <DiamondIcon />
            )}
          </span>
        </div>
      </div>

      {showSectionButtons && isMobile && (
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
  );
};

Header.defaultProps = {};

export default Header;

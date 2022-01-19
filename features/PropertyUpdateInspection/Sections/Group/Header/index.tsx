/* eslint-disable no-nested-ternary */
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import ChevronIcon from '../../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import styles from './styles.module.scss';

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
  const isCollapsed = collapsedSections.includes(section.id);
  const showSectionButtons = canEdit && section.section_type === 'multi';
  const isLastOfClonedMultiSectionSeries = section.title !== nextSectionTitle;

  return (
    <header
      className={clsx(isMobile ? styles.container : styles.containerGrid)}
    >
      <div className={styles.container__content}>
        {section.title}
        <div className={styles.container__footer}>
          {showSectionButtons && !isMobile && (
            <div className={styles.container__action}>
              {isLastOfClonedMultiSectionSeries && (
                <button
                  className={styles['button--line']}
                  onClick={(event) => onAddSection(event, section.id)}
                  data-testid="section-list-item-add-section"
                >
                  Add
                </button>
              )}
              {section.added_multi_section && (
                <button
                  className={styles['button--redOutline']}
                  onClick={(event) => onRemoveSection(event, section.id)}
                  data-testid="section-list-item-remove-section"
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <span className={isCollapsed ? styles['-collapsed'] : ''}>
            {isCollapsed || !isMobile ? (
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
        <footer
          className={clsx(
            styles.container__footer,
            isLastOfClonedMultiSectionSeries ? '' : '-jc-flex-end'
          )}
        >
          {isLastOfClonedMultiSectionSeries && (
            <button
              className={styles.button}
              onClick={(event) => onAddSection(event, section.id)}
            >
              Add
            </button>
          )}
          {section.added_multi_section && (
            <button
              className={styles['button--red']}
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

Header.defaultProps = {
  canEdit: false
};

export default Header;

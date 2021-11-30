import clsx from 'clsx';
import { FunctionComponent } from 'react';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import styles from '../../styles.module.scss';
import SectionItemList from '../SectionItemList';

interface MobileLayoutTeamItemModel {
  propertyId: string;
  section: inspectionTemplateSectionModel;
  nextSectionTitle: string;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onInputChange(
    event: React.MouseEvent<HTMLLIElement> | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  onClickOneActionNotes(item: inspectionTemplateItemModel):void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  forceVisible: boolean;
}

const SectionItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
  section,
  nextSectionTitle,
  collapsedSections,
  sectionItems,
  onSectionCollapseToggle,
  onInputChange,
  onClickOneActionNotes
}) => {
  const listItems = sectionItems.get(section.id);
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
            {section.added_multi_section && section.title !== nextSectionTitle && (
              <div className={styles.section__list__item__action}>
                <button className={styles['section__list__item__button--line']}>
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
            onInputChange={onInputChange}
            onClickOneActionNotes={onClickOneActionNotes}
          />
        ))}
      </ul>
    </li>
  );
};

SectionItem.defaultProps = {};

export default SectionItem;

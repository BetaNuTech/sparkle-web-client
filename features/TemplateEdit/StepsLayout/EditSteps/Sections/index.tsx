import { FunctionComponent } from 'react';
import TrashIcon from '../../../../../public/icons/sparkle/trash.svg';
import TemplateModel from '../../../../../common/models/template';
import styles from './styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import HamburgerIcon from '../../../../../public/icons/ios/hamburger.svg';
import AddIcon from '../../../../../public/icons/ios/add.svg';

interface Props {
  template: TemplateModel;
}

const Sections: FunctionComponent<Props> = ({ template }) => {
  const sections = template.sections || {};

  // sort sections by index
  const sortedSections = Object.keys(sections)
    .map((id) => ({ id, ...sections[id] }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

  return (
    <section>
      <header className={styles.header}>
        <h3 className={styles.header__title}>Sections</h3>
        <button className={styles.header__delete} disabled>
          <TrashIcon />
          Delete
        </button>
      </header>

      <ul>
        {sortedSections.map((section) => (
          <li key={section.id} className={styles.row}>
            <input type="checkbox" className={styles.row__checkbox} />
            <div className={styles.content}>
              <p
                className={styles.content__text}
                contentEditable
                suppressContentEditableWarning={true} // eslint-disable-line react/jsx-boolean-value
              >
                {section.title}
              </p>
            </div>
            <div className={styles.controls}>
              <span>
                {section.section_type === 'multi' ? (
                  <DiamondLayersIcon className={styles.controls__icon} />
                ) : (
                  <DiamondIcon className={styles.controls__icon} />
                )}
              </span>
              <span className={styles.controls__dragHandle}>
                <HamburgerIcon className={styles.controls__icon} />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.action}>
        <span>Add new section</span>
        <button className={styles.action__icon}>
          <AddIcon />
        </button>
      </div>
    </section>
  );
};

export default Sections;

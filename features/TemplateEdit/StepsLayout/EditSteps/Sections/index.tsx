import { FunctionComponent } from 'react';
import TrashIcon from '../../../../../public/icons/sparkle/trash.svg';
import TemplateModel from '../../../../../common/models/template';
import stepsStyles from '../styles.module.scss';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import EditableItem from '../../EditableItem';

interface Props {
  template: TemplateModel;
  forceVisible?: boolean;
}

const Sections: FunctionComponent<Props> = ({ template, forceVisible }) => {
  const sections = template.sections || {};

  // sort sections by index
  const sortedSections = Object.keys(sections)
    .map((id) => ({ id, ...sections[id] }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

  return (
    <section>
      <header className={stepsStyles.header}>
        <h3 className={stepsStyles.header__title}>Sections</h3>
        <button className={stepsStyles.deleteAction} disabled>
          <TrashIcon />
          Delete
        </button>
      </header>

      <ul>
        {sortedSections.map((section) => (
          <EditableItem
            item={section}
            key={section.id}
            forceVisible={forceVisible}
          />
        ))}
      </ul>
      <div className={stepsStyles.action}>
        <span>Add new section</span>
        <button className={stepsStyles.action__icon}>
          <AddIcon />
        </button>
      </div>
    </section>
  );
};

export default Sections;

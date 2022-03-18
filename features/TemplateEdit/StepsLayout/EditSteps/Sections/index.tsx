import { FunctionComponent } from 'react';
import TrashIcon from '../../../../../public/icons/sparkle/trash.svg';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import stepsStyles from '../styles.module.scss';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import EditableItem from '../../EditableItem';

interface Props {
  sortedSections: TemplateSectionModel[];
  forceVisible?: boolean;
  addSection(): void;
  updateSectionTitle(sectionId: string, title: string): void;
  onUpdateSectionType(section: TemplateSectionModel): void;
}

const Sections: FunctionComponent<Props> = ({
  forceVisible,
  sortedSections,
  addSection,
  updateSectionTitle,
  onUpdateSectionType
}) => (
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
          onUpdateTitle={(title) => updateSectionTitle(section.id, title)}
          onUpdateType={() => onUpdateSectionType(section)}
        />
      ))}
    </ul>
    <div className={stepsStyles.action} onClick={addSection}>
      <span>Add new section</span>
      <button className={stepsStyles.action__icon}>
        <AddIcon />
      </button>
    </div>
  </section>
);

export default Sections;

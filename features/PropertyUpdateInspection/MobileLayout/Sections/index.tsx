import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import styles from '../../styles.module.scss';
import SectionItem from '../SectionItem';

interface Props {
  propertyId: string;
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onMainInputChange(
    event: React.MouseEvent<HTMLLIElement>,
    item: inspectionTemplateItemModel,
    selectionIndex: number
  ): void;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  forceVisible?: boolean;
}

const Sections: FunctionComponent<Props> = ({
  propertyId,
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onMainInputChange,
  onClickOneActionNotes,
  sectionItems,
  forceVisible
}) => {
  if (!sections || !sections.length) {
    return null;
  }

  return (
    <ul className={styles.section__list} data-testid="inspection-section">
      {sections.map((sectionItem, i) => (
        <SectionItem
          propertyId={propertyId}
          key={sectionItem.id}
          section={sectionItem}
          nextSectionTitle={sections[i + 1] && sections[i + 1].title}
          forceVisible={forceVisible}
          collapsedSections={collapsedSections}
          onSectionCollapseToggle={onSectionCollapseToggle}
          onMainInputChange={onMainInputChange}
          onClickOneActionNotes={onClickOneActionNotes}
          sectionItems={sectionItems}
        />
      ))}
    </ul>
  );
};

export default Sections;

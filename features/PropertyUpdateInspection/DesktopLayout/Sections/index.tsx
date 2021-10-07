import { FunctionComponent } from 'react';
import inspectionTemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import SectionTitle from '../SectionTitle';

interface Props {
  propertyId: string;
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  forceVisible?: boolean;
}

const Sections: FunctionComponent<Props> = ({
  propertyId,
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  forceVisible
}) => {
  if (sections && sections.length > 0) {
    return (
      <ul data-testid="inspection-section">
        {sections.map((sectionItem, idx) => (
          <SectionTitle
            propertyId={propertyId}
            key={sectionItem.id}
            section={sectionItem}
            nextSectionTitle={sections[idx + 1] && sections[idx + 1].title}
            forceVisible={forceVisible}
            collapsedSections={collapsedSections}
            onSectionCollapseToggle={onSectionCollapseToggle}
          />
        ))}
      </ul>
    );
  }
  return null;
};

export default Sections;

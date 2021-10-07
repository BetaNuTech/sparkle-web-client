import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import Sections from './Sections';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import styles from '../styles.module.scss';
import Header from '../Header';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
  templateSections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onShareAction(): void;
  isOnline?: boolean;
  isStaging?: boolean;
}

const DesktopLayout: FunctionComponent<Props> = ({
  property,
  inspection,
  onShareAction,
  templateSections,
  collapsedSections,
  onSectionCollapseToggle,
  isOnline
}) => (
  <>
    <Header
      property={property}
      inspection={inspection}
      isOnline={isOnline}
      onShareAction={onShareAction}
    />
    <div className={styles.main}>
      <Sections
        propertyId={property.id}
        sections={templateSections}
        collapsedSections={collapsedSections}
        onSectionCollapseToggle={onSectionCollapseToggle}
      />
    </div>
  </>
);

DesktopLayout.defaultProps = {};

export default DesktopLayout;

import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Header from '../Header';
import styles from '../styles.module.scss';
import Sections from './Sections';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
  templateSections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onInputChange(
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  onShareAction(): void;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  onAddSection(sectionId: string): void;
  onRemoveSection(sectionId: string): void;
  onSaveInspection(): void;
  isOnline?: boolean;
  isStaging?: boolean;
  hasUpdates?: boolean;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
}

const DesktopLayout: FunctionComponent<Props> = ({
  property,
  inspection,
  onShareAction,
  templateSections,
  collapsedSections,
  onSectionCollapseToggle,
  onInputChange,
  onClickOneActionNotes,
  onSaveInspection,
  sectionItems,
  isOnline,
  hasUpdates,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange
}) => (
  <>
    <Header
      property={property}
      inspection={inspection}
      isOnline={isOnline}
      hasUpdates={hasUpdates}
      onShareAction={onShareAction}
      onSaveInspection={onSaveInspection}
    />
    <div className={styles.main}>
      <Sections
        propertyId={property.id}
        sections={templateSections}
        collapsedSections={collapsedSections}
        onSectionCollapseToggle={onSectionCollapseToggle}
        onInputChange={onInputChange}
        sectionItems={sectionItems}
        onClickOneActionNotes={onClickOneActionNotes}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        onItemIsNAChange={onItemIsNAChange}
      />
    </div>
  </>
);

DesktopLayout.defaultProps = {};

export default DesktopLayout;

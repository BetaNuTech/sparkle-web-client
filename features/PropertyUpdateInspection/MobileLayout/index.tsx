import { FunctionComponent } from 'react';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import parentStyles from '../styles.module.scss';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Sections from './Sections';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
  templateSections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  onShareAction(): void;
  isOnline?: boolean;
  isStaging?: boolean;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  property,
  inspection,
  onShareAction,
  templateSections,
  collapsedSections,
  onSectionCollapseToggle,
  sectionItems,
  isOnline,
  isStaging
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}/`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          Property
        </a>
      </Link>
    </>
  );

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button
        type="button"
        className={headStyle.header__button}
        onClick={onShareAction}
      >
        Share
      </button>
      {inspection.inspectionCompleted && (
        <button
          type="button"
          className={headStyle.header__button}
          data-testid="header-edit-button"
        >
          Edit
        </button>
      )}

      <button
        type="button"
        className={headStyle.header__button}
        disabled={!inspection.inspectionCompleted}
        data-testid="header-complete-button"
      >
        <FileUploadIcon />
      </button>
    </>
  );

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        left={mobileHeaderLeft}
        actions={mobileHeaderActions}
      />
      {inspection.inspectionReportURL && (
        <p className={parentStyles.header__pdfReport}>
          PDF Report is available
        </p>
      )}
      <Sections
        propertyId={property.id}
        sections={templateSections}
        collapsedSections={collapsedSections}
        onSectionCollapseToggle={onSectionCollapseToggle}
        sectionItems={sectionItems}
      />
    </>
  );
};

MobileLayout.defaultProps = {};

export default MobileLayout;
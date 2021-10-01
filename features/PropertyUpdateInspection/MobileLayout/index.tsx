import { FunctionComponent } from 'react';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import parentStyles from '../styles.module.scss';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
  onShareAction(): void;
  isOnline?: boolean;
  isStaging?: boolean;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  property,
  inspection,
  onShareAction,
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
      <header className={parentStyles.header}>
        <h1 className={parentStyles.header__title}>
          {inspection.templateName}
        </h1>
      </header>
    </>
  );
};

MobileLayout.defaultProps = {};

export default MobileLayout;

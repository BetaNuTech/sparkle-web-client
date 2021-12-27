import { FunctionComponent } from 'react';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import inspectionModel from '../../../common/models/inspection';
import propertyModel from '../../../common/models/property';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import MobileHeader from '../../../common/MobileHeader';
import styles from '../styles.module.scss';

interface HeaderModel {
  property: propertyModel;
  inspection: inspectionModel;
  isOnline: boolean;
  hasUpdates: boolean;
  onShareAction(): void;
  onSaveInspection(): void;
  canEnableEditMode: boolean;
  onEnableAdminEditMode(): void;
  isStaging: boolean;
}

const InspectionMobileHeader: FunctionComponent<HeaderModel> = ({
  property,
  inspection,
  isOnline,
  hasUpdates,
  onShareAction,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
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
      {canEnableEditMode && (
        <button
          type="button"
          className={headStyle.header__button}
          data-testid="header-edit-button"
          onClick={onEnableAdminEditMode}
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

      <button
        type="button"
        className={headStyle.header__button}
        disabled={!(hasUpdates && isOnline)}
        data-testid="header-save-button"
        onClick={onSaveInspection}
      >
        Save
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
        <p className={styles.header__pdfReport}>PDF Report is available</p>
      )}
    </>
  );
};

InspectionMobileHeader.defaultProps = {};

export default InspectionMobileHeader;

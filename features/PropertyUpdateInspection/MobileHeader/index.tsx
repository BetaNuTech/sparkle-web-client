import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import inspectionModel from '../../../common/models/inspection';
import propertyModel from '../../../common/models/property';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import ShareIcon from '../../../public/icons/sparkle/Ei-share-apple.svg';
import MobileHeader from '../../../common/MobileHeader';
import PdfReportStatus from '../PdfReportStatus';
import styles from './styles.module.scss';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
  isOnline: boolean;
  hasUpdates: boolean;
  onShareAction(): void;
  onSaveInspection(): void;
  canEnableEditMode: boolean;
  onEnableAdminEditMode(): void;
  isStaging: boolean;
  canUpdateCompleteInspection: boolean;
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
}

const InspectionMobileHeader: FunctionComponent<Props> = ({
  property,
  inspection,
  isOnline,
  hasUpdates,
  onShareAction,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
  isStaging,
  canUpdateCompleteInspection,
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  hasPdfReportGenerationFailed,
  onRegenerateReport
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
        className={clsx(
          headStyle.header__button,
          headStyle.header__button__share
        )}
        onClick={onShareAction}
      >
        <ShareIcon />
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

      {canUpdateCompleteInspection ? (
        <button
          type="button"
          className={headStyle.header__button}
          disabled={!(hasUpdates && isOnline)}
          data-testid="header-complete-button"
          onClick={onSaveInspection}
        >
          <span className={headStyle.header__button__text}>Complete</span>
          <FileUploadIcon />
        </button>
      ) : (
        <button
          type="button"
          className={headStyle.header__button}
          disabled={!(hasUpdates && isOnline)}
          data-testid="header-save-button"
          onClick={onSaveInspection}
        >
          Save
        </button>
      )}
    </>
  );

  const propertyLink = `/properties/${property.id}/`;

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        left={mobileHeaderLeft}
        actions={mobileHeaderActions}
      />
      <div className={styles.header}>
        <div className={styles.header__breadcrumb}>
          <Link href={propertyLink}>
            <a className={styles.header__propertyName}>{`${property.name}`}</a>
          </Link>
          <span className={styles.header__breadcrumb}>
            &nbsp;&nbsp;/&nbsp;&nbsp;Inspection
          </span>
        </div>
        <h1 className={styles.header__title}>{inspection.templateName}</h1>
      </div>
      <PdfReportStatus
        isPdfReportStatusShowing={isPdfReportStatusShowing}
        isPdfReportGenerating={isPdfReportGenerating}
        isPdfReportOutOfDate={isPdfReportOutOfDate}
        inspectionReportURL={inspection.inspectionReportURL}
        hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
        onCopyReportURL={onCopyReportURL}
        onRegenerateReport={onRegenerateReport}
      />
    </>
  );
};

InspectionMobileHeader.defaultProps = {
  isPdfReportStatusShowing: false,
  isPdfReportOutOfDate: false,
  isPdfReportGenerating: false,
  hasPdfReportGenerationFailed: false
};

export default InspectionMobileHeader;

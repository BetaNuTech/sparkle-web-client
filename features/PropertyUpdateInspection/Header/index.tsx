import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import PdfReportStatus from '../PdfReportStatus';
import inspectionModel from '../../../common/models/inspection';
import propertyModel from '../../../common/models/property';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import ShareIcon from '../../../public/icons/sparkle/Ei-share-apple.svg';
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
  canUpdateCompleteInspection: boolean;
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  inspection,
  isOnline,
  hasUpdates,
  onShareAction,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
  canUpdateCompleteInspection,
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  hasPdfReportGenerationFailed,
  onRegenerateReport
}) => {
  const propertyLink = `/properties/${property.id}/`;
  const isPubishingDisabled =
    !(hasUpdates && isOnline) || isPdfReportGenerating;

  const RightSide = () => (
    <div className={styles.header__item}>
      <button
        type="button"
        className={clsx(
          styles.header__item__button,
          styles.header__item__button__share
        )}
        onClick={onShareAction}
      >
        <ShareIcon />
      </button>
      {canEnableEditMode && (
        <button
          type="button"
          className={clsx(
            styles.header__item__button,
            styles['header__item__button--dark']
          )}
          data-testid="header-edit-button"
          onClick={onEnableAdminEditMode}
        >
          Edit
        </button>
      )}
      {canUpdateCompleteInspection ? (
        <button
          type="button"
          className={clsx(styles.header__item__button)}
          disabled={isPubishingDisabled}
          data-testid="header-complete-button"
          onClick={onSaveInspection}
        >
          Complete
          <span>
            <FileUploadIcon />
          </span>
        </button>
      ) : (
        <button
          type="button"
          className={clsx(styles.header__item__button)}
          disabled={isPubishingDisabled}
          data-testid="header-save-button"
          onClick={onSaveInspection}
        >
          Save
        </button>
      )}
      <PdfReportStatus
        isPdfReportStatusShowing={isPdfReportStatusShowing}
        isPdfReportGenerating={isPdfReportGenerating}
        isPdfReportOutOfDate={isPdfReportOutOfDate}
        inspectionReportURL={inspection.inspectionReportURL}
        onCopyReportURL={onCopyReportURL}
        hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
        onRegenerateReport={onRegenerateReport}
      />
    </div>
  );
  return (
    <DesktopHeader
      headerTestId="property-update-inspection-header"
      isColumnTitle
      title={
        <>
          <div className={styles.header__breadcrumb}>
            <Link href={propertyLink}>
              <a
                className={styles.header__propertyName}
              >{`${property.name}`}</a>
            </Link>
            <span className={styles.header__breadcrumb}>
              &nbsp;&nbsp;/&nbsp;&nbsp;Inspection
            </span>
          </div>
          <div>{inspection.templateName}</div>
        </>
      }
      isOnline={isOnline}
      right={<RightSide />}
    />
  );
};

Header.defaultProps = {
  isPdfReportStatusShowing: false,
  isPdfReportOutOfDate: false,
  isPdfReportGenerating: false,
  hasPdfReportGenerationFailed: false
};

export default Header;

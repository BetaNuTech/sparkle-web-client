import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import inspectionModel from '../../../common/models/inspection';
import propertyModel from '../../../common/models/property';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import ShareIcon from '../../../public/icons/sparkle/Ei-share-apple.svg';
import styles from './styles.module.scss';

interface HeaderModel {
  property: propertyModel;
  inspection: inspectionModel;
  isOnline: boolean;
  hasUpdates: boolean;
  onShareAction(): void;
  onSaveInspection(): void;
  canEnableEditMode: boolean;
  onEnableAdminEditMode(): void;
  canUpdateCompleteInspection: boolean;
}

const Header: FunctionComponent<HeaderModel> = ({
  property,
  inspection,
  isOnline,
  hasUpdates,
  onShareAction,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
  canUpdateCompleteInspection
}) => {
  const propertyLink = `/properties/${property.id}/`;
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
          disabled={!(hasUpdates && isOnline)}
          data-testid="header-complete-button"
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
          disabled={!(hasUpdates && isOnline)}
          data-testid="header-save-button"
          onClick={onSaveInspection}
        >
          Save
        </button>
      )}
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

Header.defaultProps = {};

export default Header;

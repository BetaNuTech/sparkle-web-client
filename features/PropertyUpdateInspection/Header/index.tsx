import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import inspectionModel from '../../../common/models/inspection';
import propertyModel from '../../../common/models/property';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import styles from './styles.module.scss';

interface HeaderModel {
  property: propertyModel;
  inspection: inspectionModel;
  isOnline: boolean;
  onShareAction(): void;
}

const Header: FunctionComponent<HeaderModel> = ({
  property,
  inspection,
  isOnline,
  onShareAction
}) => {
  const propertyLink = `/properties/${property.id}/`;
  const RightSide = () => (
    <div className={styles.header__item}>
      <button
        type="button"
        className={clsx(styles.header__item__button)}
        onClick={onShareAction}
      >
        Share
      </button>
      {inspection.inspectionCompleted && (
        <button
          type="button"
          className={clsx(
            styles.header__item__button,
            styles['header__item__button--dark']
          )}
          data-testid="header-edit-button"
        >
          Edit
        </button>
      )}

      <button
        type="button"
        className={clsx(styles.header__item__button)}
        disabled={!inspection.inspectionCompleted}
        data-testid="header-complete-button"
      >
        Complete
        <span>
          <FileUploadIcon />
        </span>
      </button>
    </div>
  );
  return (
    <DesktopHeader
      headerTestId="property-update-inspection-header"
      isColumnTitle
      title={
        <>
          <Link href={propertyLink}>
            <a className={styles.header__propertyName}>{`${property.name}`}</a>
          </Link>
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
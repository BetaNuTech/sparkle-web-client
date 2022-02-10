import { FunctionComponent } from 'react';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import Breadcrumbs from './Breadcrumbs';
import SortBy from './SortBy';
import styles from './styles.module.scss';

interface Props {
  property: PropertyModel;
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  sortBy: string;
  sortDir: string;
  onSortChange(key: string): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  isTablet,
  sortBy,
  sortDir,
  onSortChange
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
        className={headStyle.header__button}
        onClick={() => onSortChange('sortDir')}
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      {isTablet ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            isStaging={isStaging}
            left={mobileHeaderLeft}
            title="Deficient Items"
            actions={mobileHeaderActions}
          />
          <Breadcrumbs property={property} />
          <div className={styles.search}>
            <input className={styles.search__input} type="search" />
          </div>
          <div className={styles.sortInfoLine}>Sorted by Due/Deferred Date</div>
        </>
      ) : (
        <DesktopHeader
          title={<Breadcrumbs property={property} />}
          isOnline={isOnline}
          right={
            <SortBy
              onSortChange={onSortChange}
              sortBy={sortBy}
              sortDir={sortDir}
            />
          }
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;

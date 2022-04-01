import { ChangeEvent, FunctionComponent } from 'react';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import styles from './styles.module.scss';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import SortDropdown from '../../../common/SortDropdown';

const sortOptions = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Last Update', value: 'updatedAt' }
];

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  property: PropertyModel;
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextResidentsSort(): void;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  property,
  sortDir,
  sortBy,
  userFacingSortBy,
  nextResidentsSort,
  onSortChange,
  onSortDirChange
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}`}>
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
        onClick={() => nextResidentsSort()}
      >
        <FolderIcon />
      </button>
    </>
  );
  const BreadCrumbs = () => (
    <>
      <div className={styles.header__breadcrumbs}>
        <Link href={`/properties/${property.id}`}>
          <a className={styles.header__link}>{property.name}</a>
        </Link>
      </div>
      <div className={styles.header__title}>Work Orders</div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            left={mobileHeaderLeft}
            actions={mobileHeaderActions}
            isStaging={isStaging}
            title={`${property.name.toUpperCase()} WOs`}
          />
          <div className={styles.search}>
            <input className={styles.search__input} type="search" />

            <button className={styles.search__clear} />
          </div>
          <div className={styles.sortInfoLine}>
            Sorted by {userFacingSortBy}
          </div>
        </>
      ) : (
        <DesktopHeader
          title={<BreadCrumbs />}
          isOnline={isOnline}
          isColumnTitle
          right={
            <SortDropdown
              sortDir={sortDir}
              sortBy={sortBy}
              options={sortOptions}
              onSortChange={onSortChange}
              onSortDirChange={onSortDirChange}
            />
          }
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;

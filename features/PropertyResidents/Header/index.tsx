import { ChangeEvent, FunctionComponent } from 'react';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import styles from './styles.module.scss';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import string from '../../../common/utils/string';
import FilterDropdown from './FilterDropdown';
import SortDropdown from '../../../common/SortDropdown';

const sortOptions = [
  { label: 'Unit', value: 'leaseUnit' },
  { label: 'Resident ID', value: 'id' },
  { label: 'Resident First Name', value: 'firstName' },
  { label: 'Resident Last Name', value: 'lastName' },
  { label: 'Current Status', value: 'yardiStatus' }
];

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  property: PropertyModel;
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
  sortBy: string;
  sortDir: string;
  userFacingSortBy: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  nextResidentsSort(): void;
  onFilterByStatus(evt: ChangeEvent<HTMLSelectElement>): void;
  onNextResidentFilterByStatus(): void;
  activeFilter: string;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  property,
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  sortDir,
  sortBy,
  userFacingSortBy,
  nextResidentsSort,
  onSortChange,
  onSortDirChange,
  onFilterByStatus,
  onNextResidentFilterByStatus,
  activeFilter
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
        onClick={() => onNextResidentFilterByStatus()}
      >
        {string.titleize(activeFilter)}
      </button>
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
      <div className={styles.header__title}>Residents</div>
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
            title="Residents"
          />
          <div className={styles.search}>
            <input
              className={styles.search__input}
              type="search"
              value={searchQuery}
              onChange={onSearchKeyDown}
            />

            {searchQuery && (
              <button
                className={styles.search__clear}
                onClick={onClearSearch}
              />
            )}
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
            <>
              <FilterDropdown
                activeFilter={activeFilter}
                onFilterByStatus={onFilterByStatus}
              />
              <SortDropdown
                options={sortOptions}
                sortDir={sortDir}
                sortBy={sortBy}
                onSortChange={onSortChange}
                onSortDirChange={onSortDirChange}
              />
            </>
          }
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;

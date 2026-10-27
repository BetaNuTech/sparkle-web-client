import { ChangeEvent, KeyboardEvent, FunctionComponent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import SortDropdown from '../../../common/SortDropdown';
import MobileSearchBar from '../../../common/MobileSearchBar';
import Filters from '../Filters';
import { WorkOrderState } from '../hooks/useWorkOrderFilters';

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
  searchQuery: string;
  onSearchKeyDown: (
    ev: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  // Filters
  state: WorkOrderState;
  unit: string;
  from: string;
  to: string;
  hasFilters: boolean;
  onStateChange(evt: ChangeEvent<HTMLSelectElement>): void;
  nextState(): void;
  onUnitChange(evt: ChangeEvent<HTMLInputElement>): void;
  onFromChange(evt: ChangeEvent<HTMLInputElement>): void;
  onToChange(evt: ChangeEvent<HTMLInputElement>): void;
  onClearFilters(): void;
  canCreate: boolean;
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
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  onSortChange,
  onSortDirChange,
  state,
  unit,
  from,
  to,
  hasFilters,
  onStateChange,
  nextState,
  onUnitChange,
  onFromChange,
  onToChange,
  onClearFilters,
  canCreate
}) => {
  const createLink = `/properties/${property.id}/yardi-work-orders/new`;

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
        onClick={() => nextState()}
        data-testid="work-order-state-toggle"
      >
        {state === 'open' ? 'Open' : 'Closed'}
      </button>
      <button
        className={headStyle.header__button}
        onClick={() => nextResidentsSort()}
      >
        <FolderIcon />
      </button>
      {canCreate && (
        <Link href={createLink}>
          <a
            className={headStyle.header__button}
            data-testid="work-order-create-link"
          >
            <AddIcon />
          </a>
        </Link>
      )}
    </>
  );

  const BreadCrumbs = () => (
    <>
      <div className={styles.header__breadcrumbs}>
        <Link href={`/properties/${property.id}`}>
          <a className={styles.header__link}>{property.name}</a>
        </Link>
      </div>
      <div className={styles.header__title}>
        {state === 'open' ? 'Open' : 'Closed'} Work Orders
      </div>
    </>
  );

  const filterProps = {
    state,
    unit,
    from,
    to,
    hasFilters,
    onStateChange,
    onUnitChange,
    onFromChange,
    onToChange,
    onClearFilters
  };

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
          <MobileSearchBar
            searchQuery={searchQuery}
            onChange={onSearchKeyDown}
            onClearSearch={onClearSearch}
          />
          <Filters {...filterProps} isMobile />
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
              {canCreate && (
                <Link href={createLink}>
                  <a
                    className={clsx(styles.header__create, '-mr')}
                    data-testid="work-order-create-link"
                  >
                    Create Work Order
                  </a>
                </Link>
              )}
              <SortDropdown
                sortDir={sortDir}
                sortBy={sortBy}
                options={sortOptions}
                onSortChange={onSortChange}
                onSortDirChange={onSortDirChange}
              />
            </>
          }
          nextLine={<Filters {...filterProps} />}
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;

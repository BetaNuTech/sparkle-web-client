import { ChangeEvent, FunctionComponent } from 'react';
import MobileHeader from '../../../common/MobileHeader';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import DesktopHeader from '../../../common/DesktopHeader';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';
import MobileSearchBar from '../../../common/MobileSearchBar';
import SortDropdown from '../../../common/SortDropdown';
import { sortOptions } from '../settings';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  toggleNavOpen(): void;
  sortBy: string;
  sortDir: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  nextUserSort(): void;
  userFacingSortBy: string;
  searchValue: string;
  onSearchKeyDown(evt: ChangeEvent<HTMLInputElement>): void;
  onClearSearch(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  toggleNavOpen,
  sortBy,
  sortDir,
  onSortChange,
  onSortDirChange,
  nextUserSort,
  userFacingSortBy,
  onSearchKeyDown,
  onClearSearch,
  searchValue
}) => {
  // Mobile Header right actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <LinkFeature
        href="/users/edit/new"
        legacyHref="/admin/users/add"
        featureEnabled={features.supportUserEdit}
        className={headStyle.header__button}
      >
        <AddIcon />
      </LinkFeature>

      <button className={headStyle.header__button} onClick={nextUserSort}>
        <FolderIcon />
      </button>
    </>
  );

  // Desktop Header actions buttons
  const DesktopActions = () => (
    <>
      <LinkFeature
        href="/users/edit/new"
        legacyHref="/admin/users/add"
        featureEnabled={features.supportUserEdit}
        className={styles.action}
      >
        Create
        <span className={styles.addIcon}>
          <AddIcon />
        </span>
      </LinkFeature>
      <SortDropdown
        options={sortOptions}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={onSortChange} // eslint-disable-line @typescript-eslint/no-empty-function
        onSortDirChange={onSortDirChange} // eslint-disable-line @typescript-eslint/no-empty-function
      />
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            toggleNavOpen={toggleNavOpen}
            isStaging={isStaging}
            title="Users"
            actions={mobileHeaderActions}
          />
          <MobileSearchBar
            searchQuery={searchValue}
            onChange={onSearchKeyDown} // eslint-disable-line @typescript-eslint/no-empty-function
            onClearSearch={onClearSearch} // eslint-disable-line @typescript-eslint/no-empty-function
          />
          <div className={styles.sortInfoLine}>
            Sorted by {userFacingSortBy}
          </div>
        </>
      ) : (
        <DesktopHeader
          title={<span>Users</span>}
          isOnline={isOnline}
          right={<DesktopActions />}
        />
      )}
    </>
  );
};

export default Header;

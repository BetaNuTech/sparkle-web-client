import { ChangeEvent, FunctionComponent } from 'react';
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
  isMobile: boolean;
  sortBy: string;
  sortDir: string;
  userFacingSortBy: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  nextDeficientItemSort(): void;
  searchQuery: string;
  onSearchKeyDown: any;
  onClearSearch(): void;
  toggleNavOpen?(): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  isMobile,
  sortBy,
  sortDir,
  onSortChange,
  onSortDirChange,
  nextDeficientItemSort,
  userFacingSortBy,
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  toggleNavOpen
}) => {
  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button
        className={headStyle.header__button}
        onClick={() => nextDeficientItemSort()}
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            isStaging={isStaging}
            toggleNavOpen={toggleNavOpen}
            title="Deficient Items"
            actions={mobileHeaderActions}
          />
          <Breadcrumbs property={property} />
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
          title={<Breadcrumbs property={property} />}
          isOnline={isOnline}
          right={
            <SortBy
              onSortChange={onSortChange}
              onSortDirChange={onSortDirChange}
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

import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import AddIcon from '../../../public/icons/ios/add.svg';
import CategoryIcon from '../../../public/icons/sparkle/category.svg';
import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';

import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  toggleNavOpen?(): void;
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
  onManageCategory(): void;
  canManageCategories: boolean;
  canCreate: boolean;
  onCreateTemplate(): void;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  toggleNavOpen,
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  onManageCategory,
  canManageCategories,
  canCreate,
  onCreateTemplate
}) => {
  // Desktop Header actions buttons
  const DesktopActions = () => (
    <div className={styles.actions}>
      {canManageCategories && (
        <button
          type="button"
          className={clsx(
            styles.actions__button,
            styles['actions__button--dark']
          )}
          onClick={onManageCategory}
        >
          Manage Categories
        </button>
      )}

      {canCreate && (
        <button
          type="button"
          className={styles.actions__button}
          disabled={!isOnline}
          onClick={() => onCreateTemplate()}
          data-testid="header-add-template-action"
        >
          Add Template
          <span className={styles.addIcon}>
            <AddIcon />
          </span>
        </button>
      )}
    </div>
  );

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {canManageCategories && (
        <button className={headStyle.header__button} onClick={onManageCategory}>
          <CategoryIcon />
        </button>
      )}
      {canCreate && (
        <button
          className={headStyle.header__button}
          disabled={!isOnline}
          onClick={() => onCreateTemplate()}
        >
          <AddIcon />
        </button>
      )}
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
            title="Templates"
            actions={mobileHeaderActions}
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
        </>
      ) : (
        <DesktopHeader
          title={<span>Templates</span>}
          isOnline={isOnline}
          right={<DesktopActions />}
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;

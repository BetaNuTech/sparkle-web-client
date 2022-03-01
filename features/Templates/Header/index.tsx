import { FunctionComponent } from 'react';
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
  onManageCategory(): void;
  canManageCategories: boolean;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  toggleNavOpen,
  onManageCategory,
  canManageCategories
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

      <button type="button" className={styles.actions__button}>
        Add Template
        <span className={styles.addIcon}>
          <AddIcon />
        </span>
      </button>
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
      <button className={headStyle.header__button}>
        <AddIcon />
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
            title="Templates"
            actions={mobileHeaderActions}
          />
          <div className={styles.search}>
            <input className={styles.search__input} type="search" />
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
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './MobileHeader.module.scss';
import { Dropdown } from '../../../common/Dropdown';
import AddIcon from '../../../public/icons/ios/add.svg';
import HamburgerIcon from '../../../public/icons/ios/hamburger.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';

export const MobileHeader = ({
  title,
  toggleNavOpen,
  nextPropertiesSort,
  isStaging,
  isOnline
}) => {
  const offlineTheme = isOnline === false ? styles['header--isOffline'] : '';
  const stagingTheme = isOnline && isStaging ? styles['header--isStaging'] : '';
  const containerTheme = offlineTheme || stagingTheme;

  return (
    <header
      className={clsx(styles.header, containerTheme)}
      data-testid="mobile-properties-header"
    >
      {/* Navigation Elements */}
      <aside className={styles.header__aside}>
        <button
          className={styles.header__button}
          onClick={toggleNavOpen}
          tabIndex={0}
        >
          <HamburgerIcon />
        </button>
      </aside>

      {/* Page Name */}
      <div className={styles.header__main}>
        <h1 className={styles.header__title}>{title}</h1>
      </div>

      {/* Secondary Actions */}
      <aside className={styles.header__aside}>
        <button
          className={clsx(
            styles.header__button,
            styles['header__button--dropdown']
          )}
        >
          <AddIcon />
          <Dropdown />
        </button>
        {/* TODO: set sort dir desc on `lastInspectionDate` &
        `lastInspectionScore` */}
        <button className={styles.header__button}>
          <FolderIcon onClick={nextPropertiesSort} />
        </button>
      </aside>
    </header>
  );
};

MobileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  toggleNavOpen: PropTypes.func.isRequired,
  nextPropertiesSort: PropTypes.func.isRequired,
  isStaging: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool.isRequired
};

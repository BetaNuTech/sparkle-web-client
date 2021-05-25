import clsx from 'clsx';
import styles from './Header.module.scss';
import AddIcon from '../../../public/icons/ios/add.svg';
import HamburgerIcon from '../../../public/icons/ios/hamburger.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import { Dropdown } from '../../screens/properties/Dropdown';

export const Header = ({ title, handleClickOpenNav, appMode }) => (
  <header
    // appMode = isStaging || isOffline || '';
    className={
      appMode ? clsx(styles.header, styles[`header${appMode}`]) : styles.header
    }
  >
    {/* Navigation Elements */}
    <aside className={styles.header__aside}>
      <button
        className={styles.header__button}
        onClick={handleClickOpenNav}
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
      <button className={styles.header__button}>
        <FolderIcon />
      </button>
    </aside>
  </header>
);

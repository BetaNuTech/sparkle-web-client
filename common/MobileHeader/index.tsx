import { FunctionComponent } from 'react';
import clsx from 'clsx';

import HamburgerIcon from '../../public/icons/ios/hamburger.svg';
import styles from './styles.module.scss';

interface Props {
  title?: string;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  isOnline?: boolean;
  actions?(any): React.ReactNode | React.ReactNodeArray;
}

const MobileHeader: FunctionComponent<Props> = ({
  title,
  toggleNavOpen,
  isStaging,
  isOnline,
  actions
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
        {toggleNavOpen && (
          <button
            className={styles.header__button}
            onClick={toggleNavOpen}
            tabIndex={0}
            data-testid="mobile-hamburger"
          >
            <HamburgerIcon />
          </button>
        )}
      </aside>

      {/* Page Name */}
      <div className={styles.header__main}>
        {title && (
          <h1
            data-testid="mobile-header-title"
            className={styles.header__title}
          >
            {title}
          </h1>
        )}
      </div>

      {/* {actions && } */}
      <aside className={styles.header__aside} data-testid="mobile-actions">
        {typeof actions === 'function' && actions(styles)}
      </aside>
    </header>
  );
};

export default MobileHeader;

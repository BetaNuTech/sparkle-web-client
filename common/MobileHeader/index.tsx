import { FunctionComponent } from 'react';
import clsx from 'clsx';

import HamburgerIcon from '../../public/icons/ios/hamburger.svg';
import WarningIcon from '../../public/icons/sparkle/warning.svg';
import styles from './styles.module.scss';

interface Props {
  title?: string;
  testid?: string;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  isOnline?: boolean;
  actions?(any): React.ReactNode | React.ReactNodeArray;
  left?(any): React.ReactNode | React.ReactNodeArray;
  className?: any;
}

const MobileHeader: FunctionComponent<Props> = ({
  title,
  toggleNavOpen,
  isStaging,
  isOnline,
  actions,
  left,
  className,
  testid
}) => {
  const offlineTheme = isOnline === false ? styles['header--isOffline'] : '';
  const stagingTheme = isOnline && isStaging ? styles['header--isStaging'] : '';
  const containerTheme = offlineTheme || stagingTheme;

  return (
    <header
      className={clsx(styles.header, containerTheme, className && className)}
      data-testid={testid}
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
        {typeof left === 'function' && left(styles)}
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
      {!isOnline && (
        <footer className={styles.header__footer}>
          <WarningIcon />
          <span className="-pl-sm">
            You&lsquo;re disconnected, further updates may be lost.
          </span>
        </footer>
      )}
    </header>
  );
};

MobileHeader.defaultProps = {
  testid: 'mobile-header'
};

export default MobileHeader;

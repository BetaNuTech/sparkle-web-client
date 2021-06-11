import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAuth } from '../../navigation/Auth/AuthProvider';
import styles from './SlideNav.module.scss';

export const SlideNav = ({ toggleNavOpen, isStaging, isOnline }) => {
  const { user, signOut } = useAuth();
  const offlineTheme = isOnline === false ? styles['slideNav--isOffline'] : '';
  const stagingTheme =
    isOnline && isStaging ? styles['slideNav--isStaging'] : '';
  const containerTheme = offlineTheme || stagingTheme;

  return (
    <nav className={clsx(styles.slideNav, containerTheme)}>
      <div className={styles.slideNav__wrapper}>
        {/* Logo And Close Button */}
        <header className={styles.slideNav__header}>
          <button
            onClick={toggleNavOpen}
            tabIndex={0}
            className={styles.slideNav__header__closeButton}
          >
            <img src="/icons/sparkle/cancel-simple.svg" alt="Close" />
          </button>
          <div className={styles.slideNav__header__logo}>
            <img src="/icons/sparkle/logo.svg" alt="Logo" />
          </div>
        </header>

        {/* Navigation links */}
        <div className={styles.slideNav__links}>
          <div>
            <div className={styles.slideNav__links__link}>
              <Link href="/properties">
                <a>Properties</a>
              </Link>
            </div>
            <div className={styles.slideNav__links__link}>
              <Link href="/templates">
                <a>Templates</a>
              </Link>
            </div>
            <div className={styles.slideNav__links__link}>
              <Link href="/users">
                <a>Users</a>
              </Link>
            </div>
          </div>

          <div>
            <div className={styles.slideNav__links__link}>
              <Link href={user ? `/admin/users/${user.uid}` : '/admin/users/'}>
                <a>Profile</a>
              </Link>
            </div>
            <div className={styles.slideNav__links__link}>
              <Link href="/settings">
                <a>Settings</a>
              </Link>
            </div>
            <div className={styles.slideNav__links__link}>
              <div
                className={styles.slideNav__links__signOut}
                onClick={() => signOut()}
                role="button"
                tabIndex={0}
              >
                Sign Out
              </div>
            </div>
          </div>
        </div>

        {/* Logo And Additional Information */}
        <footer className={styles.slideNav__footer}>
          <img
            src="/icons/sparkle/bluestone-logo.svg"
            alt="Logo"
            className={styles.slideNav__footer__logo}
          />
          <div className={styles.slideNav__footer__version}>V2.5.2</div>
        </footer>
      </div>
    </nav>
  );
};

SlideNav.propTypes = {
  toggleNavOpen: PropTypes.func.isRequired,
  isStaging: PropTypes.bool.isRequired,
  isOnline: PropTypes.bool.isRequired
};

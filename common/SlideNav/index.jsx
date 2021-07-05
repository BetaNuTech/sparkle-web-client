import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import { useAuth } from '../Auth/Provider';
import styles from './SlideNav.module.scss';
import Logo from '../../public/icons/sparkle/logo.svg';
import BusinessLogo from '../../public/icons/sparkle/bluestone-logo.svg';
import CancelIcon from '../../public/icons/sparkle/cancel-simple.svg';

export const SlideNav = ({ toggleNavOpen, isStaging, isOnline }) => {
  const { userId, signOut } = useAuth();
  const offlineTheme = isOnline === false ? styles['slideNav--isOffline'] : '';
  const stagingTheme =
    isOnline && isStaging ? styles['slideNav--isStaging'] : '';
  const containerTheme = offlineTheme || stagingTheme;

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  return (
    <nav className={clsx(styles.slideNav, containerTheme)}>
      <div className={styles.slideNav__wrapper}>
        {/* Logo And Close Button */}
        <header
          className={clsx(
            styles.slideNav__header,
            isDesktop && styles.slideNav__desktop
          )}
        >
          {isMobileorTablet ? (
            <button
              onClick={toggleNavOpen}
              tabIndex={0}
              className={styles.slideNav__header__closeButton}
            >
              <CancelIcon />
            </button>
          ) : null}
          <div className={styles.slideNav__header__logo}>
            <Logo />
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
            {userId && (
              <div className={styles.slideNav__links__link}>
                <Link href={`/admin/users/${userId}`}>
                  <a>Profile</a>
                </Link>
              </div>
            )}
            <div className={styles.slideNav__links__link}>
              <Link href="/settings">
                <a>Settings</a>
              </Link>
            </div>
            <div className={styles.slideNav__links__link}>
              <div
                className={clsx(styles.slideNav__links__signOut, '-cu-pointer')}
                onClick={signOut}
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
          <div className={styles.slideNav__footer__logo}>
            <BusinessLogo />
          </div>
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

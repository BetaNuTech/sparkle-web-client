import clsx from 'clsx';
import Link from 'next/link';
import { useAuth } from '../../../navigation/Auth/AuthProvider';
import styles from './SlideNav.module.scss';

export const SlideNav = ({ handleClickOpenNav, appMode }) => {
  const { user, signOut } = useAuth();

  return (
    <nav
      className={
        // appMode = isStaging || isOffline || '';
        appMode
          ? clsx(styles.slideNav, styles[`slideNav${appMode}`])
          : styles.slideNav
      }
    >
      <div className={styles.slideNav__wrapper}>
        {/* Logo And Close Button */}
        <header className={styles['slideNav-header']}>
          <div
            onClick={handleClickOpenNav}
            role="button"
            tabIndex={0}
            className={styles['slideNav-header__closeButton']}
          >
            <img src="/icons/sparkle/cancel-simple.svg" alt="Close" />
          </div>
          <div className={styles['slideNav-header__logo']}>
            <img src="/icons/sparkle/logo.svg" alt="Logo" />
          </div>
        </header>

        {/* Navigation links */}
        <div className={styles['slideNav-links']}>
          <div className={styles['slideNav-links-wrapper']}>
            <div className={styles['slideNav-links__link']}>
              <Link href="/properties">
                <a>Properties</a>
              </Link>
            </div>
            <div className={styles['slideNav-links__link']}>
              <Link href="/templates">
                <a>Templates</a>
              </Link>
            </div>
            <div className={styles['slideNav-links__link']}>
              <Link href="/users">
                <a>Users</a>
              </Link>
            </div>
          </div>
          <div className={styles['slideNav-links-wrapper']}>
            <div className={styles['slideNav-links__link']}>
              <Link href={user ? `/admin/users/${user.uid}` : '/admin/users/'}>
                <a>Profile</a>
              </Link>
            </div>
            <div className={styles['slideNav-links__link']}>
              <Link href="/settings">
                <a>Settings</a>
              </Link>
            </div>
            <div className={styles['slideNav-links__link']}>
              <div
                className={styles['slideNav-links__signOut']}
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
        <footer className={styles['slideNav-footer']}>
          <img
            src="/icons/sparkle/bluestone-logo.svg"
            alt="Logo"
            className={styles['slideNav-footer__logo']}
          />
          <div className={styles['slideNav-footer__version']}>V2.5.2</div>
        </footer>
      </div>
    </nav>
  );
};

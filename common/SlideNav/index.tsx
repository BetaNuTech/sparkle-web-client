import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import features from '../../config/features';
import LinkFeature from '../LinkFeature';
import { useAuth } from '../Auth/Provider';
import styles from './styles.module.scss';
import Logo from '../../public/icons/sparkle/logo.svg';
import BusinessLogo from '../../public/icons/sparkle/bluestone-logo.svg';
import CancelIcon from '../../public/icons/sparkle/cancel-simple.svg';

interface Props {
  toggleNavOpen?(): void;
  isStaging?: boolean;
  isOnline?: boolean;
  appVersion?: string;
}

const SlideNav: FunctionComponent<Props> = ({
  toggleNavOpen,
  isStaging,
  isOnline,
  appVersion
}) => {
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
              <LinkFeature
                featureEnabled={features.supportBetaPropertiesList}
                href="/properties"
              >
                Properties
              </LinkFeature>
            </div>
            <div className={styles.slideNav__links__link}>
              <LinkFeature
                featureEnabled={features.supportBetaTemplatesList}
                href="/templates"
              >
                Templates
              </LinkFeature>
            </div>
            <div className={styles.slideNav__links__link}>
              <LinkFeature
                featureEnabled={features.supportBetaUsers}
                href="/users"
              >
                Users
              </LinkFeature>
            </div>
          </div>

          <div>
            {userId && (
              <div className={styles.slideNav__links__link}>
                <LinkFeature
                  featureEnabled={features.supportBetaUserProfile}
                  href={`/admin/users/${userId}`}
                >
                  Profile
                </LinkFeature>
              </div>
            )}
            <div className={styles.slideNav__links__link}>
              <LinkFeature
                featureEnabled={features.supportBetaSettings}
                href="/settings"
              >
                Settings
              </LinkFeature>
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
          {/* Release Version */}
          {appVersion && (
            <div
              data-testid="app-release-version"
              className={styles.slideNav__footer__version}
            >
              v{appVersion}
            </div>
          )}
        </footer>
      </div>
    </nav>
  );
};

SlideNav.defaultProps = {
  appVersion: '0.0.0'
};

export default SlideNav;

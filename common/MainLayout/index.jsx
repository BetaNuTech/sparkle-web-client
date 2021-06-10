import clsx from 'clsx';
import { useState } from 'react';
import styles from './MainLayout.module.scss';
import { SlideNav } from '../SlideNav';
import { useNavigatorOnline } from '../utils/getOnlineStatus';

export const MainLayout = ({ children }) => {
  // TODO share start
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isOnline = useNavigatorOnline();

  const handleClickOpenNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const appMode = (() => {
    if (!isOnline) return '--isOffline';
    if (process.env.NEXT_PUBLIC_STAGING === 'true') return '--isStaging';
    return '';
  })();

  return (
    <div
      className={
        isNavOpen
          ? clsx(styles.wrapper, styles['wrapper--open'])
          : styles.wrapper
      }
    >
      <SlideNav
        isNavOpen={isNavOpen}
        handleClickOpenNav={handleClickOpenNav}
        appMode={appMode}
      />
      <main className={styles.mainSide}>{children}</main>
    </div>
  );
};

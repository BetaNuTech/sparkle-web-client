import clsx from 'clsx';
import React, { useState } from 'react';
import { Header } from '../../common/Header';
import { SlideNav } from '../../common/SlideNav';
import styles from './DefaultLayout.module.scss';
import { useNavigatorOnline } from '../../../utils/getOnlineStatus';

export const DefaultLayout = ({ children }) => {
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
      <main className={styles.mainSide}>
        <Header
          title="Properties"
          isNavOpen={isNavOpen}
          handleClickOpenNav={handleClickOpenNav}
          appMode={appMode}
        />
        {children}
      </main>
    </div>
  );
};

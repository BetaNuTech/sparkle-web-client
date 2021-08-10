import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import styles from './styles.module.scss';
import SlideNav from '../SlideNav';
import { useNavigatorOnline } from '../utils/getOnlineStatus';

const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true';
const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const APP_VERSION = publicRuntimeConfig.appVersion || '';

export const MainLayout = ({ children }) => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isOnline = useNavigatorOnline();

  // Open & close slide navigation
  const toggleNavOpen = () => setIsNavOpen(!isNavOpen);

  // Remove null children
  const filteredChildren = Array.isArray(children)
    ? children.filter(Boolean)
    : children;

  // Expose main layout
  // values to children
  const childrenWithProps = React.Children.map(filteredChildren, (child) =>
    React.cloneElement(child, {
      isNavOpen,
      toggleNavOpen,
      isOnline,
      isStaging
    })
  );

  useEffect(() => {
    const handleRouteChange = () => {
      // Check if mobile side nav os open
      // then close it
      if (isNavOpen) {
        toggleNavOpen();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        isOnline={isOnline}
        isStaging={isStaging}
        toggleNavOpen={toggleNavOpen}
        appVersion={APP_VERSION}
      />
      <main className={styles.mainSide}>{childrenWithProps}</main>
    </div>
  );
};

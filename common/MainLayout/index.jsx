import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles.module.scss';
import { SlideNav } from '../SlideNav';
import { useNavigatorOnline } from '../utils/getOnlineStatus';

const isStaging = process.env.NEXT_PUBLIC_STAGING === 'true';

export const MainLayout = ({ children }) => {
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
      />
      <main className={styles.mainSide}>{childrenWithProps}</main>
    </div>
  );
};

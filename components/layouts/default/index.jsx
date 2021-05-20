import clsx from 'clsx';
import React, { useState } from 'react';
import { Header } from '../../common/Header';
import { SlideNav } from '../../common/SlideNav';
import styles from './DefaultLayout.module.scss';

export const DefaultLayout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleClickOpenNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div
      className={
        isNavOpen
          ? clsx(styles.wrapper, styles['wrapper--open'])
          : styles.wrapper
      }
    >
      <SlideNav isNavOpen={isNavOpen} handleClickOpenNav={handleClickOpenNav} />
      <main className={styles.mainSide}>
        <Header
          title="Properties"
          isNavOpen={isNavOpen}
          handleClickOpenNav={handleClickOpenNav}
        />
        {children}
      </main>
    </div>
  );
};

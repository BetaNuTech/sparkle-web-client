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
    <>
      <Header title='Properties' isNavOpen={isNavOpen} handleClickOpenNav={handleClickOpenNav} />
      <SlideNav isNavOpen={isNavOpen} handleClickOpenNav={handleClickOpenNav} />
      <div className={isNavOpen ? clsx(styles.mainSide, styles['mainSide--shortened']) : styles.mainSide}>
        {children}
      </div>
    </>
  );
};

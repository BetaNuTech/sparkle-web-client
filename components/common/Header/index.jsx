import clsx from 'clsx';
import styles from './Header.module.scss';

export const Header = ({ title, isNavOpen, handleClickOpenNav }) => (
  <div className={isNavOpen ? clsx(styles.header, styles['header--shortened']) : styles.header}>
    <div className={styles['header-wrapper']}>

      <div className={clsx(styles['header-cols'], styles['left-col'])}>
        <div onClick={handleClickOpenNav} role="button" tabIndex={0} className={styles['left-col-elem']}>
          <img src="/icons/ios/hamburger.svg" alt="Burger" className={styles['left-col__burgerNavButton']} />
        </div>
      </div>

      <div className={clsx(styles['header-cols'], styles['central-col'])}>
        <div className={styles['central-col-elem']}>
          <div className={styles['central-col__title']}>{title}</div>
        </div>
      </div>

      <div className={clsx(styles['header-cols'], styles['right-col'])}>
        <div className={styles['right-col-elem']}>
          <img src="/icons/ios/add.svg" alt="Add" className={styles['right-col__addButton']} />
        </div>
        <div className={styles['right-col-elem']}>
          <img src="/icons/ios/folder.svg" alt="Folder" className={styles['right-col__folderButton']} fill="white" />
        </div>
      </div>

    </div>
  </div>
);

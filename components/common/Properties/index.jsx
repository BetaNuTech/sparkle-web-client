import React, { useState } from 'react';
import styles from './Properties.module.scss';
import { Header } from './Header';
import { ProfileList } from './ProfileList';
import { Sidebar } from './Sidebar';
import { MobileProperties } from './MobileProperties';

export const Properties = () => {
  const [isAscendingSort, setIsAscendingSort] = useState(true);

  return (
    <div className={styles.properties}>
      <div className={styles.properties__wrapper}>
        <header>
          <Header
            isAscendingSort={isAscendingSort}
            setIsAscendingSort={setIsAscendingSort}
          />
        </header>

        <div className={styles.properties__main}>
          <ProfileList isAscendingSort={isAscendingSort} />
        </div>

        <aside>
          <Sidebar />
        </aside>
      </div>

      <div className={styles.properties__mobile}>
        <MobileProperties />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import styles from './Properties.module.scss';
import { Header } from './Header';
import { ProfileList } from './ProfileList';
import { Sidebar } from './Sidebar';

export const Properties = () => {
  const [isAscendingSort, setIsAscendingSort] = useState(true);

  return (
    <div className={styles.properties}>
      <header>
        <Header
          isAscendingSort={isAscendingSort}
          setIsAscendingSort={setIsAscendingSort}
        />
      </header>

      <div className={styles.properties__main}>
        <ProfileList />
      </div>

      <aside>
        <Sidebar />
      </aside>
    </div>
  );
};

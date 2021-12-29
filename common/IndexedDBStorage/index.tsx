import clsx from 'clsx';
import { FunctionComponent } from 'react';
import useIndexedDBStorage from '../hooks/useIndexedDBStorage';

import styles from './styles.module.scss';

interface IndexedDBStorage {
  hiddenUntil: number;
}

const IndexedDBStorage: FunctionComponent<IndexedDBStorage> = ({
  hiddenUntil
}) => {
  const {
    usedSpacePercentage,
    availableSpacePercentage
  } = useIndexedDBStorage();
  const showWarning = usedSpacePercentage >= 75;
  const showAlert = usedSpacePercentage >= 90;

  if (usedSpacePercentage < hiddenUntil) {
    return null;
  }
  return (
    <div className={styles.indexedDBStorage}>
      <div className={styles.indexedDBStorage__progress}>
        <span
          className={styles.indexedDBStorage__progress__text}
          data-test-progress-remaining
        >
          Storage {availableSpacePercentage}%
        </span>
        <div
          className={clsx(
            styles.indexedDBStorage__progress__bar,
            showWarning && styles['indexedDBStorage__progress__bar--warning'],
            showAlert && styles['indexedDBStorage__progress__bar--danger']
          )}
          style={{ width: `${usedSpacePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

IndexedDBStorage.defaultProps = {
  hiddenUntil: 0
};

export default IndexedDBStorage;

import { useEffect, useState } from 'react';

import errorReports from '../services/api/errorReports';

const PREFIX = 'common: hooks: useIndexedDBStorage:';
interface useIndexedDBStorage {
  usedSpacePercentage: number;
  availableSpacePercentage: number;
  setStorageSpacePercentage(): void;
}

// Hooks for get available and used local indexedDB storage percentage

export default function useIndexedDBStorage(): useIndexedDBStorage {
  const [usedSpacePercentage, setUsedSpacePercentage] = useState(0);
  const [availableSpacePercentage, setAvailableSpacePercentage] = useState(0);

  // set available and used storage space percentage
  const setStorageSpacePercentage = async () => {
    if (navigator && navigator.storage && navigator.storage.estimate) {
      // get current usage and storage quota
      await navigator.storage
        .estimate()
        .then(({ usage, quota }) => {
          const percentage = Math.round((usage / quota) * 100) || 0;
          setUsedSpacePercentage(percentage);
          setAvailableSpacePercentage(100 - percentage);
        })
        .catch((err) => {
          const wrappedErr = Error(
            `${PREFIX} setStorageSpacePercentage: ${err}`
          );
          errorReports.send(wrappedErr); // eslint-disable-line
        });
    }
  };

  useEffect(() => {
    setStorageSpacePercentage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    usedSpacePercentage,
    availableSpacePercentage,
    setStorageSpacePercentage
  };
}

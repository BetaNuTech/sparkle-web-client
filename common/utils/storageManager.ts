<<<<<<< HEAD
const persist = async () => {
=======
let requestedPersistentStorageThisSession = false;

const requestPersistentStorage = async (): Promise<boolean> => {
  requestedPersistentStorageThisSession = true;

>>>>>>> 9ef84cae8bee0d9a286bdc13f2ed6a7606bdb4c0
  if (typeof window !== 'undefined') {
    return (
      (await window.navigator.storage) &&
      navigator.storage.persist &&
      navigator.storage.persist()
    );
  }
<<<<<<< HEAD
};
const isStoragePersisted = async () => {
=======

  return false;
};

const isStoragePersistent = async (): Promise<boolean> => {
>>>>>>> 9ef84cae8bee0d9a286bdc13f2ed6a7606bdb4c0
  if (typeof window !== 'undefined') {
    return (
      (await window.navigator.storage) &&
      navigator.storage.persisted &&
      window.navigator.storage.persisted()
    );
  }
<<<<<<< HEAD
};

const initStorageManager = () => {
  isStoragePersisted().then(async (isPersisted) => {
    if (!isPersisted) {
      persist();
    }
  });
};

export default initStorageManager;
=======

  return false;
};

const setupPersistentStorage = async (): void => {
  if (requestedPersistentStorageThisSession) return;
  const isPersisted = await isStoragePersistent();

  if (!isPersisted) {
    await requestPersistentStorage();
  }
};

export default { setupPersistentStorage };
>>>>>>> 9ef84cae8bee0d9a286bdc13f2ed6a7606bdb4c0

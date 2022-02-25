let requestedPersistentStorageThisSession = false;

const requestPersistentStorage = async (): Promise<boolean> => {
  requestedPersistentStorageThisSession = true;

  if (typeof window !== 'undefined') {
    return (
      (await window.navigator.storage) &&
      navigator.storage.persist &&
      navigator.storage.persist()
    );
  }

  return false;
};

const isStoragePersistent = async (): Promise<boolean> => {
  if (typeof window !== 'undefined') {
    return (
      (await window.navigator.storage) &&
      navigator.storage.persisted &&
      window.navigator.storage.persisted()
    );
  }

  return false;
};

const setupPersistentStorage = async () => {
  if (requestedPersistentStorageThisSession) return;
  const isPersisted = await isStoragePersistent();

  if (!isPersisted) {
    await requestPersistentStorage();
  }
};

export default { setupPersistentStorage };

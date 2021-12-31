import firebase from 'firebase/app';
import storageApi from '../services/storage';

const PREFIX = 'common: hooks: useStorage:';

export type StorageResult = {
  fileUrl: string;
  fileDestination: string;
};
interface useStorageResult {
  uploadFileToStorage(destination: string, file: File): Promise<StorageResult>;
  uploadBase64FileToStorage(
    destination: string,
    base64: string
  ): Promise<StorageResult>;
}

const taskEvent = (firebase.storage || {}).TaskEvent || {
  STATE_CHANGED: ''
};
const STATE_CHANGED_EVENT = taskEvent.STATE_CHANGED || 'state_changed';

// Hooks to perform uploading a file to firebase storage
export default function useStorage(): useStorageResult {
  const uploadFileToStorage = (destination: string, file: File) =>
    new Promise<StorageResult>((resolve, reject) => {
      let uploadTask = null;
      try {
        uploadTask = storageApi.createUploadTask(destination, file);
      } catch (err) {
        reject(Error(`${PREFIX} failed to create upload task: ${err}`));
      }

      uploadTask.on(
        STATE_CHANGED_EVENT,
        () => {
          // On Upload start
        },
        (err) => {
          // Storage errors
          reject(
            Error(
              `${PREFIX} uploadFileToStorage: storeage upload failed: ${err}`
            )
          );
        },
        async () => {
          // Upload completed successfully
          let fileUrl = '';
          try {
            // Download file url
            fileUrl = await storageApi.getFileUrl(uploadTask.snapshot.ref);
            resolve({ fileUrl, fileDestination: destination });
          } catch (err) {
            reject(
              Error(
                `${PREFIX} uploadFileToStorage: filed to get file URL: ${err}`
              )
            );
          }
        }
      );
    });

  const uploadBase64FileToStorage = (destination: string, base64: string) =>
    new Promise<StorageResult>((resolve, reject) => {
      let uploadTask = null;
      try {
        uploadTask = storageApi.createBase64UploadTask(destination, base64);
      } catch (err) {
        reject(Error(`${PREFIX} failed to create upload task: ${err}`));
      }

      uploadTask.on(
        STATE_CHANGED_EVENT,
        () => {
          // On Upload start
        },
        (err) => {
          // Storage errors
          reject(
            Error(
              `${PREFIX} uploadFileToStorage: storeage upload failed: ${err}`
            )
          );
        },
        async () => {
          // Upload completed successfully
          let fileUrl = '';
          try {
            // Download file url
            fileUrl = await storageApi.getFileUrl(uploadTask.snapshot.ref);
            resolve({ fileUrl, fileDestination: destination });
          } catch (err) {
            reject(
              Error(
                `${PREFIX} uploadBase64FileToStorage: filed to get file URL: ${err}`
              )
            );
          }
        }
      );
    });

  return { uploadFileToStorage, uploadBase64FileToStorage };
}

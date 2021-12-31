import firebase from 'firebase/app';

const PREFIX = 'common: services: storage:';

export default {
  createUploadTask(location: string, file: File): firebase.storage.UploadTask {
    // Create a storage reference
    const storageRef = firebase.storage().ref();
    const filePath = `${location}`;

    // Create a reference to image reference in storage
    const fileRef = storageRef.child(filePath);

    const metadata = {
      contentType: file.type
    };

    // Create a upload task
    const uploadTask = fileRef.put(file, metadata);

    return uploadTask;
  },

  createBase64UploadTask(
    location: string,
    base64: string
  ): firebase.storage.UploadTask {
    // Create a storage reference
    const storageRef = firebase.storage().ref();
    const filePath = `${location}`;

    // Create a reference to image reference in storage
    const fileRef = storageRef.child(filePath);

    // Create a upload task for base64 string
    const uploadBase64Task = fileRef.putString(base64, 'data_url');
    return uploadBase64Task;
  },

  // Lookup uploaded
  // storage file's URL
  getFileUrl: async (
    stroageRef: firebase.storage.Reference
  ): Promise<string> => {
    try {
      const fileUrl = await stroageRef.getDownloadURL();
      return fileUrl;
    } catch (err) {
      throw Error(`${PREFIX} getFileUrl: ${err}`);
    }
  },

  // Remove a fail from
  // anywhere in firebase storage
  async deleteFile(location: string): Promise<any> {
    // Create a storage reference
    const storageRef = firebase.storage().ref();

    // Create a reference to image reference in storage
    const fileRef = storageRef.child(location);

    // Perform delete operation
    try {
      await fileRef.delete();
    } catch (err) {
      throw Error(`${PREFIX} deleteFile: ${err}`);
    }
  }
};

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
  }
};

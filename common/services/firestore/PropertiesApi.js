import { firestore } from '../../utils/connectFirebase';

export const PropertiesApi = {
  async getMe() {
    const { docs } = await firestore.collection('properties').get();

    return docs;
  },

  async fetchDataOfProperties() {
    const objectsArray = [];
    /**
     * Get all the collection from firestore
     */
    const { docs } = await firestore.collection('properties').get();
    docs.forEach((doc) => {
      /**
       * Push each doc in the array with the id.
       * We will need id for other future references
       */
      objectsArray.push({ id: doc.id, ...doc.data() });
    });
    return objectsArray;
  }
};

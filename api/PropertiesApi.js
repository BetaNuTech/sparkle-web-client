import { firestore } from '../utils/connectFirebase';

export const PropertiesApi = {
  async getMe() {
    const { docs } = await firestore.collection('properties').get();

    return docs;
  },
};

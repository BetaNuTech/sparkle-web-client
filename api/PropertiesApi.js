import { firestore } from '../utils/connectFirebase';

export const PropertiesApi = {
  async getMe() {
    const { data } = await firestore.collection('properties').get();
    return data;
  }
};

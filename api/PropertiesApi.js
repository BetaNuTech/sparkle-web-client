import { firestore } from '../utils/connectFirebase';

export const PropertiesApi = {
  async getMe() {
    const { data } = await firestore.collection('users').get();

    return data;
  }
};

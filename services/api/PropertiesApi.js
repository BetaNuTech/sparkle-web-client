import { firestore } from '../../utils/connectFirebase';
import propertiesMock from '../../__mocks__/propertiesMock.json';

export const PropertiesApi = {
  async getMe() {
    const { docs } = await firestore.collection('properties').get();

    return docs;
  },

  async fetchDataOfProperties() {
    const data = propertiesMock;

    return data;
  }
};

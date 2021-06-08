import { firestore } from '../../common/utils/connectFirebase';
import propertiesMock from '../../__mocks__/PropertiesPage/propertiesMock.json';

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

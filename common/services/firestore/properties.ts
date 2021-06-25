import firebase from 'firebase/app';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import propertyModel from '../../models/property';

const PREFIX = 'common: services: firestore: properties:';
const COLLECTION_NAME = 'properties';

// Result of properties collection query
export interface propertiesCollectionResult {
  status: string;
  error?: Error;
  data: Array<propertyModel>;
}

export default {
  // Create query for all an
  // organizations' properties
  findAll(): propertiesCollectionResult {
    const query = useFirestore().collection(COLLECTION_NAME);

    const {
      status,
      error,
      data: firstoreData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    // Cast firestore data into property records
    const data = firstoreData.map((itemData: any) => itemData as propertyModel);

    // Result
    return { status, error, data };
  },

  // Remove a property record
  deleteRecord(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): Promise<void> {
    return firestore
      .collection(COLLECTION_NAME)
      .doc(propertyId)
      .delete()
      .catch((err) => Promise.reject(Error(`${PREFIX} deleteRecord: ${err}`))); // wrap error
  }
};

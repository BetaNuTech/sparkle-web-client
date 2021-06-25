import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
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
  findAll(firestore: firebase.firestore.Firestore): propertiesCollectionResult {
    const query = firestore.collection(COLLECTION_NAME);

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

  // Lookup properties by their id's
  queryRecords(
    firestore: firebase.firestore.Firestore,
    ids: Array<string>
  ): propertiesCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];

    // If we do not have any ids,
    // do not call firestore query
    if (ids.length > 0) {
      const query = firestore
        .collection('properties')
        .where(firebase.firestore.FieldPath.documentId(), 'in', ids);

      const {
        status: queryStatus,
        error: queryError,
        data: queryData = []
      } = useFirestoreCollectionData(query, {
        idField: 'id'
      });

      status = queryStatus;
      error = queryError;

      // Cast firestore data into property records
      data = queryData.map((itemData: any) => itemData as propertyModel);
    }

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

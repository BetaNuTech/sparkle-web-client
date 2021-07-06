import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
import inspectionModel from '../../models/inspection';

const PREFIX = 'common: services: firestore: inspections:';
const COLLECTION_NAME = 'inspections';

// Result of inspections collection query
export interface inspectionCollectionResult {
  status: string;
  error?: Error;
  data: Array<inspectionModel>;
}

// Result of inspection single document
export interface propertyResult {
  status: string;
  error?: Error;
  data: inspectionModel;
}

export default {
  // Lookup property inspections by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): propertyResult {
    let status = 'success';
    let error = null;
    let data = null;

    const query = firestore
      .collection(COLLECTION_NAME)
      .where('property', '==', propertyId);

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
    data = queryData.map((itemData: any) => itemData as inspectionModel);

    // Result
    return { status, error, data };
  },

  // Remove a inspection record
  deleteRecord(
    firestore: firebase.firestore.Firestore,
    inspectionId: string
  ): Promise<void> {
    return firestore
      .collection(COLLECTION_NAME)
      .doc(inspectionId)
      .delete()
      .catch((err) => Promise.reject(Error(`${PREFIX} deleteRecord: ${err}`))); // wrap error
  }
};

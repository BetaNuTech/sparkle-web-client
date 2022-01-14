import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import inspectionModel from '../../models/inspection';

const PREFIX = `common: services: firestore: ${fbCollections.inspections}:`;

// Result of inspections collection query
export interface inspectionCollectionResult {
  status: string;
  error?: Error;
  data: Array<inspectionModel>;
}

// Result of inspection single document
export interface DocumentResult {
  status: string;
  error?: Error;
  data: inspectionModel;
}

export default {
  // Lookup inspection by id
  findRecord(
    firestore: firebase.firestore.Firestore,
    inspectionId: string
  ): DocumentResult {
    let status = 'success';
    let error = null;
    let data = {} as inspectionModel;

    const docRef = firestore
      .collection(fbCollections.inspections)
      .doc(inspectionId);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;
    // Cast firestore data into property records
    data = queryData as inspectionModel;

    // Convert the data for template item mainInputType to lowercase
    if (data && data.template && data.template.items) {
      const keys = Object.keys(data.template.items);
      keys.forEach((key) => {
        if (data.template.items[key].mainInputType) {
          data.template.items[key].mainInputType =
            data.template.items[key].mainInputType.toLowerCase();
        }
      });
    }

    // Result
    return { status, error, data };
  },

  // Lookup property inspections by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): DocumentResult {
    let status = 'success';
    let error = null;
    let data = null;

    const query = firestore
      .collection(fbCollections.inspections)
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
      .collection(fbCollections.inspections)
      .doc(inspectionId)
      .delete()
      .catch((err) => Promise.reject(Error(`${PREFIX} deleteRecord: ${err}`))); // wrap error
  }
};

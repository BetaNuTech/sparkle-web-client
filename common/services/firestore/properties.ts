import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import propertyModel from '../../models/property';
import fbCollections from '../../../config/collections';

const PREFIX = `common: services: firestore: ${fbCollections.properties}:`;

// Result of properties collection query
export interface propertiesCollectionResult {
  status: string;
  error?: Error;
  data: Array<propertyModel>;
}

// Result of properties document
export interface propertyResult {
  status: string;
  error?: Error;
  data: propertyModel;
}

export default {
  // Create query for all an
  // organizations' properties
  findAll(firestore: firebase.firestore.Firestore): propertiesCollectionResult {
    const query = firestore.collection(fbCollections.properties);

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
        .collection(fbCollections.properties)
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

  // Lookup property by it's id
  findRecord(
    firestore: firebase.firestore.Firestore,
    id: string
  ): propertyResult {
    let status = 'success';
    let error = null;
    let data = {} as propertyModel;

    const docRef = firestore.collection(fbCollections.properties).doc(id);

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
    data = queryData as propertyModel;

    // Result
    return { status, error, data };
  },

  // Remove a property record
  deleteRecord(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): Promise<void> {
    return firestore
      .collection(fbCollections.properties)
      .doc(propertyId)
      .delete()
      .catch((err) => Promise.reject(Error(`${PREFIX} deleteRecord: ${err}`))); // wrap error
  }
};

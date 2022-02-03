import firebase from 'firebase/app';
import { useFirestoreDocData, useFirestoreCollectionData } from 'reactfire';
import userModel from '../../models/user';
import fbCollections from '../../../config/collections';

// Result of user document query
export interface userDocumentResult {
  status: string;
  error?: Error;
  data: userModel;
}

export interface userCollectionResult {
  status: string;
  error?: Error;
  data: userModel[];
}

export default {
  // Create query for single user record
  findRecord(
    firestore: firebase.firestore.Firestore,
    userId: string
  ): userDocumentResult {
    const userRef = firestore.collection(fbCollections.users).doc(userId);
    const {
      status,
      error,
      data: userData
    } = useFirestoreDocData(userRef, {
      idField: 'id'
    });

    // Cast firestore data into team records
    const data = userData as userModel;

    // Result
    return { status, error, data };
  },

  // Lookup users by their id's
  query(
    firestore: firebase.firestore.Firestore,
    ids: string[]
  ): userCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];

    // If we do not have any ids,
    // do not call firestore query
    if (ids.length > 0) {
      const query = firestore
        .collection(fbCollections.users)
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

      // Cast firestore data into users records
      data = queryData.map((itemData: any) => itemData as userModel);
    }

    // Result
    return { status, error, data };
  }
};

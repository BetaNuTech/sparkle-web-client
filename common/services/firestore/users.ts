import firebase from 'firebase/app';
import { useFirestoreDocData, useFirestoreCollectionData } from 'reactfire';
import UserModel from '../../models/user';
import fbCollections from '../../../config/collections';

// Result of user document query
export interface UserDocumentResult {
  status: string;
  error?: Error;
  data: UserModel;
}

export interface UserCollectionResult {
  status: string;
  error?: Error;
  data: UserModel[];
}

export default {
  // Create query for single user record
  findRecord(
    firestore: firebase.firestore.Firestore,
    userId: string
  ): UserDocumentResult {
    const userRef = firestore.collection(fbCollections.users).doc(userId);
    const {
      status,
      error,
      data: userData
    } = useFirestoreDocData(userRef, {
      idField: 'id'
    });

    // Cast firestore data into team records
    const data = userData as UserModel;

    // Result
    return { status, error, data };
  },

  // Lookup users by their id's
  query(
    firestore: firebase.firestore.Firestore,
    ids: string[]
  ): UserCollectionResult {
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
      data = queryData.map((itemData: any) => itemData as UserModel);
    }

    // Result
    return { status, error, data };
  },

  // Lookup all users
  findAll(firestore: firebase.firestore.Firestore): UserCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];

    const query = firestore.collection(fbCollections.users);

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
    data = queryData.map((itemData: any) => itemData as UserModel);

    // Result
    return { status, error, data };
  }
};

import firebase from 'firebase/app';
import { useFirestoreDocData } from 'reactfire';
import userModel from '../../models/user';
import fbCollections from '../../../config/collections';

// Result of user document query
export interface userDocumentResult {
  status: string;
  error?: Error;
  data: userModel;
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
  }
};

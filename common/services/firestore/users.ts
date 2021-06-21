import { useFirestore, useFirestoreDocData } from 'reactfire';
import userModel from '../../models/user';

// Result of user document query
export interface userDocumentResult {
  status: string;
  error?: Error;
  data: userModel;
}

export default {
  // Create query for single user record
  findRecord(userId: string): userDocumentResult {
    const userRef = useFirestore().collection('users').doc(userId);
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

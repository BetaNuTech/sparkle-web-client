import firebase from 'firebase/app';
import { useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';

// Result of template single document
export interface trelloIntegrationResult {
  status: string;
  error?: Error;
  data: any;
}

export default {
  // Get Trello user
  getUser(firestore: firebase.firestore.Firestore): trelloIntegrationResult {
    let status = 'success';
    let error = null;
    let data = {} as any;

    const docRef = firestore
      .collection(fbCollections.integrations)
      .doc('trello');

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;
    data = queryData as any;

    // Result
    return { status, error, data };
  },

  // Get reference to a Firestore database path
  getPropertyIntegrationDetails(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): trelloIntegrationResult {
    let status = 'success';
    let error = null;
    let data = {} as any;

    const docRef = firestore
      .collection(fbCollections.integrations)
      .doc(`trello-${propertyId}`);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;
    data = queryData as any;

    // Result
    return { status, error, data };
  }
};

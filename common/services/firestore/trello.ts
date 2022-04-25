import firebase from 'firebase/app';
import { useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import TrelloIntegrationModel from '../../models/trelloIntegration';
import propertyTrelloIntegrationModel from '../../models/propertyTrelloIntegration';

// Result of template single document
export interface trelloUserResult {
  status: string;
  error?: Error;
  data: TrelloIntegrationModel;
}

export interface trelloIntegrationResult {
  status: string;
  error?: Error;
  data: propertyTrelloIntegrationModel;
}

export default {
  // Get Trello user
  getUser(firestore: firebase.firestore.Firestore): trelloUserResult {
    let status = 'success';
    let error = null;
    let data = {} as TrelloIntegrationModel;

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
    data = queryData as TrelloIntegrationModel;

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
    let data = {} as propertyTrelloIntegrationModel;

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
    data = queryData as propertyTrelloIntegrationModel;

    // Result
    return { status, error, data };
  }
};

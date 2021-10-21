import firebase from 'firebase/app';
import { useFirestoreDocDataOnce } from 'reactfire';
import fbCollections from '../../../config/collections';
import propertyTrelloIntegrationModel from '../../models/propertyTrelloIntegration';

export interface yardiIntegrationResult {
  status: string;
  error?: Error;
  data: any;
}

export interface trelloIntegrationResult {
  error?: Error;
  payload: propertyTrelloIntegrationModel;
}

export default {
  queryYardi(firestore: firebase.firestore.Firestore): yardiIntegrationResult {
    // Yardi document in integration collection of firestore
    const docRef = firestore
      .collection(fbCollections.integrations)
      .doc('yardi');

    const {
      status,
      error,
      data: docData = {}
    } = useFirestoreDocDataOnce(docRef, {
      idField: 'id'
    });

    // Result
    return { status, error, data: docData };
  },

  // Set a Property's Trello integration in Firestore
  // creates record if non-existent, otherwise updates it
  upsertPropertyTrelloRecord(
    firestore: firebase.firestore.Firestore,
    propertyId: string,
    payload: propertyTrelloIntegrationModel
  ): Promise<propertyTrelloIntegrationModel> {
    return firestore
      .collection(fbCollections.integrations)
      .doc(`trello-${propertyId}`)
      .set(payload, { merge: true })
      .then(() => payload as propertyTrelloIntegrationModel)
      .catch((err) =>
        Promise.reject(
          Error(
            `services: firestore: integrations: upsertPropertyTrelloRecord: failed: ${err}`
          )
        )
      );
  }
};

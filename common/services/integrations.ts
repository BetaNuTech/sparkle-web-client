import firebase from 'firebase/app';
import { useFirestoreDocDataOnce } from 'reactfire';
import fbCollections from '../../config/collections';

export interface yardiIntegrationResult {
  status: string;
  error?: Error;
  data: any;
}

export default {
  queryYardiRecord(
    firestore: firebase.firestore.Firestore
  ): yardiIntegrationResult {
    // Yardi document in integration collection of firestore
    const docRef = firestore.collection(fbCollections.integrations).doc('yardi');

    const {
      status,
      error,
      data: docData = {}
    } = useFirestoreDocDataOnce(docRef, {
      idField: 'id'
    });

    // Result
    return { status, error, data: docData };
  }
};

import firebase from 'firebase/app';
import { useFirestoreDocDataOnce } from 'reactfire';

const COLLECTION_NAME = 'integrations';

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
    const docRef = firestore.collection(COLLECTION_NAME).doc('yardi');

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

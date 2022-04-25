import firebase from 'firebase/app';
import { useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import SlackIntegrationModel from '../../models/slackIntegration';

export interface SlackResult {
  status: string;
  error?: Error;
  data: SlackIntegrationModel;
}

export default {
  // Get users slack integration details
  findRecord(firestore: firebase.firestore.Firestore): SlackResult {
    let status = 'success';
    let error = null;
    let data = {} as SlackIntegrationModel;

    const docRef = firestore
      .collection(fbCollections.integrations)
      .doc('slack');

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;
    data = queryData as SlackIntegrationModel;

    // Result
    return { status, error, data };
  }
};

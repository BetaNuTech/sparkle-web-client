import firebase from 'firebase/app';
import { useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import attachmentModel from '../../models/attachments';

const PREFIX = 'services: api: firestore: attachments';

// Result of attachment document
export interface attachmentResult {
  status: string;
  error?: Error;
  data: attachmentModel;
}

export default {
  // Save attachment record
  saveRecord(
    firestore: firebase.firestore.Firestore,
    attachment: attachmentModel
  ): Promise<string> {
    return firestore
      .collection(fbCollections.attachments)
      .add(attachment)
      .then((docRef) => Promise.resolve(docRef.id))
      .catch((err) => {
        const wrappedErr = Error(
          `${PREFIX} saveRecord: failed to create attachment record: ${err}`
        );

        return Promise.reject(wrappedErr);
      });
  },
  // Lookup attachment by it's id
  findRecord(firestore: firebase.firestore.Firestore, id: string): attachmentResult {
    let status = 'success';
    let error = null;
    let data = {} as attachmentModel;

    const docRef = firestore.collection(fbCollections.attachments).doc(String(id));

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into attachment record
    data = queryData as attachmentModel;

    // Result
    return { status, error, data };
  }
};

import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import bidModel from '../../models/bid';
import bidAttachmentModel from '../../models/bidAttachment';

const PREFIX = 'services: api: firestore: bids';

// Result of bids collection query
export interface bidsCollectionResult {
  status: string;
  error?: Error;
  data: Array<bidModel>;
}

// Result of bid document
export interface bidResult {
  status: string;
  error?: Error;
  data: bidModel;
}

export default {
  // Lookup jobs bids by job id
  queryByJob(
    firestore: firebase.firestore.Firestore,
    jobId: string
  ): bidsCollectionResult {
    let status = 'success';
    let error = null;
    let data = null;

    // Get job ref from job id
    const jobDocRef = firebase
      .firestore()
      .collection(fbCollections.jobs)
      .doc(jobId);

    // Query the bids collection using job ref
    const query = firestore
      .collection(fbCollections.bids)
      .where('job', '==', jobDocRef);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into job model records
    data = queryData.map((itemData: any) => itemData as bidModel);

    // Result
    return { status, error, data };
  },

  // Lookup bid by it's id
  findRecord(firestore: firebase.firestore.Firestore, id: string): bidResult {
    let status = 'success';
    let error = null;
    let data = {} as bidModel;

    const docRef = firestore.collection(fbCollections.bids).doc(id);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into property records
    data = queryData as bidModel;

    // Result
    return { status, error, data };
  },

  // Add attachment record to bids document
  addBidAttachment(
    firestore: firebase.firestore.Firestore,
    id: string,
    attachment: bidAttachmentModel
  ): Promise<bidAttachmentModel> {
    // Update attachment record to firestore
    return firestore
      .collection(fbCollections.bids)
      .doc(id)
      .update({
        attachments: firebase.firestore.FieldValue.arrayUnion(attachment)
      })
      .then(() => attachment)
      .catch((err) => {
        const wrappedErr = Error(
          `${PREFIX} updateBidAttachment: failed to update bid attachments: ${err}`
        );

        return Promise.reject(wrappedErr);
      });
  }
};

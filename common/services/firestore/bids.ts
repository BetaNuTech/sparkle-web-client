import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
import fbCollections from '../../../config/collections';
import bidModel from '../../models/bid';

// Result of bids collection query
export interface bidsCollectionResult {
  status: string;
  error?: Error;
  data: Array<bidModel>;
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
  }
};

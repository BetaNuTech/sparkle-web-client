import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import jobModel from '../../models/job';

const COLLECTION_NAME = 'jobs';

// Result of jobs collection query
export interface jobCollectionResult {
  status: string;
  error?: Error;
  data: Array<jobModel>;
}

// Result of jobs document
export interface jobResult {
  status: string;
  error?: Error;
  data: jobModel;
}

export default {
  // Lookup property jobs by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): jobCollectionResult {
    let status = 'success';
    let error = null;
    let data = null;

    const propertyDocRef = firebase
      .firestore()
      .collection('properties')
      .doc(propertyId);

    const query = firestore
      .collection(COLLECTION_NAME)
      .where('property', '==', propertyDocRef);

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
    data = queryData.map((itemData: any) => itemData as jobModel);

    // Result
    return { status, error, data };
  },

  // Lookup job by it's id
  findRecord(firestore: firebase.firestore.Firestore, id: string): jobResult {
    let status = 'success';
    let error = null;
    let data = {} as jobModel;

    const docRef = firestore.collection(COLLECTION_NAME).doc(id);

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
    data = queryData as jobModel;

    // Result
    return { status, error, data };
  }
};

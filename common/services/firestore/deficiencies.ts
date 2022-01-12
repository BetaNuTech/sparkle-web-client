import firebase from 'firebase/app';
import { useFirestoreDocData, useFirestoreCollectionData } from 'reactfire';
import deficientItemModel from '../../models/deficientItem';
import fbCollections from '../../../config/collections';

// Result of deficiencies document
export interface deficientItemResult {
  status: string;
  error?: Error;
  data: deficientItemModel;
}

export interface deficientItemsListResult {
  status: string;
  error?: Error;
  data: deficientItemModel[];
}

export default {
  // Lookup deficient item by it's id
  findRecord(
    firestore: firebase.firestore.Firestore,
    id: string
  ): deficientItemResult {
    let status = 'success';
    let error = null;
    let data = {} as deficientItemModel;

    const docRef = firestore.collection(fbCollections.deficiencies).doc(id);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into deficiency records
    data = queryData as deficientItemModel;

    // Result
    return { status, error, data };
  },

  // Lookup property deficient items by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): deficientItemsListResult {
    let status = 'success';
    let error = null;
    let data = null;

    const query = firestore
      .collection(fbCollections.deficiencies)
      .where('property', '==', propertyId);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData = [] as deficientItemModel[]
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;
    data = [...queryData];
    // Result
    return { status, error, data };
  }
};

import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
import templateModel from '../../models/template';

const COLLECTION_NAME = 'templates';

// Result of templates collection query
export interface templatesCollectionResult {
  status: string;
  error?: Error;
  data: Array<templateModel>;
}

export default {
  // Lookup property templates by property id
  queryByProperty(
    firestore: firebase.firestore.Firestore,
    propertyId: string
  ): templatesCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];

    const query = firestore
      .collection(COLLECTION_NAME)
      .where('properties', 'array-contains', propertyId);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into property records
    data = queryData.map((itemData: any) => itemData as templateModel);

    // Result
    return { status, error, data };
  }
};

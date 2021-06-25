import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
import teamModel from '../../models/team';

// Result of teams collection query
export interface teamsCollectionResult {
  status: string;
  error?: Error;
  data: Array<teamModel>;
}

export default {
  // Create query for all an
  // organizations' teams
  findAll(firestore: firebase.firestore.Firestore): teamsCollectionResult {
    const query = firestore.collection('teams');

    const {
      status,
      error,
      data: firstoreData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    // Cast firestore data into team records
    const data = firstoreData.map((teamData: any) => teamData as teamModel);

    // Result
    return { status, error, data };
  },

  // Lookup group of teams by their id's
  queryRecords(
    firestore: firebase.firestore.Firestore,
    ids: Array<string>
  ): teamsCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];
    // If we do not have any ids,
    // do not call firestore query
    if (ids.length > 0) {
      const query = firestore
        .collection('teams')
        .where(firebase.firestore.FieldPath.documentId(), 'in', ids);

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
      data = queryData.map((itemData: any) => itemData as teamModel);
    }

    // Result
    return { status, error, data };
  }
};

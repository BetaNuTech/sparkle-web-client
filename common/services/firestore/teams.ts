import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import fbCollections from '../../../config/collections';
import teamModel from '../../models/team';

// const PREFIX = `common: services: firestore: ${fbCollections.teams}:`;

// Result of teams collection query
export interface teamsCollectionResult {
  status: string;
  error?: Error;
  data: teamModel[];
}

export interface teamResult {
  status: string;
  error?: Error;
  data: teamModel;
}

export default {
  // Create query for all an
  // organizations' teams
  findAll(firestore: firebase.firestore.Firestore): teamsCollectionResult {
    const query = firestore.collection(fbCollections.teams);

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
    // call query with undefined id
    // to avoid conditional hook rendering error
    const dbIds = ids.length > 0 ? [...ids] : ['undefined'];
    const query = firestore
      .collection(fbCollections.teams)
      .where(firebase.firestore.FieldPath.documentId(), 'in', dbIds);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into team records
    data = queryData.map((itemData: any) => itemData as teamModel);

    // Result
    return { status, error, data };
  },

  // Lookup team by it's id
  findRecord(firestore: firebase.firestore.Firestore, id: string): teamResult {
    let status = 'success';
    let error = null;
    let data = {} as teamModel;

    const docRef = firestore.collection(fbCollections.teams).doc(id);

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into team records
    data = queryData as teamModel;

    // Result
    return { status, error, data };
  }
};

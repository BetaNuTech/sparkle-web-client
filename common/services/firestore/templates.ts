import firebase from 'firebase/app';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import templateModel from '../../models/template';
import fbCollections from '../../../config/collections';

// Result of templates collection query
export interface templatesCollectionResult {
  status: string;
  error?: Error;
  data: Array<templateModel>;
}

// Result of template single document
export interface templateResult {
  status: string;
  error?: Error;
  data: templateModel;
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
      .collection(fbCollections.templates)
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
  },

  // Lookup all templates
  findAll(firestore: firebase.firestore.Firestore): templatesCollectionResult {
    let status = 'success';
    let error = null;
    let data = [];

    const query = firestore.collection(fbCollections.templates);

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
  },

  // Lookup template by id
  findRecord(
    firestore: firebase.firestore.Firestore,
    templateId: string
  ): templateResult {
    let status = 'success';
    let error = null;
    let data = {} as templateModel;

    const docRef = firestore
      .collection(fbCollections.templates)
      .doc(String(templateId));

    const {
      status: queryStatus,
      error: queryError,
      data: queryData
    } = useFirestoreDocData(docRef, {
      idField: 'id'
    });

    status = queryStatus;
    error = queryError;

    // Cast firestore data into template model
    data = queryData as templateModel;

    // Result
    return { status, error, data };
  }
};

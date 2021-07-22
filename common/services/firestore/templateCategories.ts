import firebase from 'firebase/app';
import { useFirestoreCollectionData } from 'reactfire';
import templateCategoryModel from '../../models/templateCategory';
import fbCollections from '../../../config/collections';

// const PREFIX = `common: services: firestore: ${fbCollections.templateCategories}:`;

// Result of array of template categories collection query
export interface templateCategoriesCollectionResult {
  status: string;
  error?: Error;
  data: Array<templateCategoryModel>;
}

// Result of single template categories collection
export interface templateCategoryResult {
  status: string;
  error?: Error;
  data: templateCategoryModel;
}

export default {
  // Create query for all an
  // all template categories
  findAll(
    firestore: firebase.firestore.Firestore
  ): templateCategoriesCollectionResult {
    const query = firestore.collection(fbCollections.templateCategories);

    const {
      status,
      error,
      data: firstoreData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    // Cast firestore data into template category model
    const data = firstoreData.map(
      (itemData: any) => itemData as templateCategoryModel
    );

    // Result
    return { status, error, data };
  }
};

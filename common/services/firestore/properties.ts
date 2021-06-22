import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import propertyModel from '../../models/property';

// Result of properties collection query
export interface propertiesCollectionResult {
  status: string;
  error?: Error;
  data: Array<propertyModel>;
}

export default {
  // Create query for all an
  // organizations' properties
  findAll(): propertiesCollectionResult {
    const query = useFirestore().collection('properties');

    const {
      status,
      error,
      data: firstoreData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    // Cast firestore data into property records
    const data = firstoreData.map((itemData: any) => itemData as propertyModel);

    // Result
    return { status, error, data };
  }
};

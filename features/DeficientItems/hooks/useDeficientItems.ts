import deficientItemModel from '../../../common/models/deficientItem';
import deficienciesDb from '../../../common/services/firestore/deficiencies';

export interface result {
  status: string;
  error?: Error;
  data: deficientItemModel[];
}

// Data hooks for to lookup all
// a properties Deficient Items
export default function useDeficientItems(
  firestore: any, // eslint-disable-line
  propertyId: string
): result {
  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [] as deficientItemModel[]
  };

  const queryResult = deficienciesDb.queryByProperty(firestore, propertyId);
  Object.assign(payload, queryResult);

  return payload;
}

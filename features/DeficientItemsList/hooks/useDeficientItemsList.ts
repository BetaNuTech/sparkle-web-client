import deficientItemModel from '../../../common/models/deficientItem';
import deficienciesDb, {
  deficientItemsListResult
} from '../../../common/services/firestore/deficiencies';

// Hooks for Deficient Item
export default function useDeficientItemsList(
  firestore: any, // eslint-disable-line
  propertyId: string
): deficientItemsListResult {
  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [] as deficientItemModel[]
  };

  const result = deficienciesDb.queryByProperty(firestore, propertyId);
  Object.assign(payload, result);

  return payload;
}

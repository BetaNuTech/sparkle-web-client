import deficientItemModel from '../../../common/models/deficientItem';
import deficienciesDb, {
  deficientItemResult
} from '../../../common/services/firestore/deficiencies';

// Hooks for Deficient Item
export default function useDeficientItem(
  firestore: any, // eslint-disable-line
  deficientItemId: string
): deficientItemResult {
  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as deficientItemModel
  };

  const result = deficienciesDb.findRecord(firestore, deficientItemId);
  Object.assign(payload, result);

  return payload;
}

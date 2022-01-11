import deficientItemModel from '../models/deficientItem';
import deficienciesDb, {
  deficiencyResult
} from '../services/firestore/deficiencies';

// Hooks for Deficient Item
export default function useDeficiencies(
  firestore: any, // eslint-disable-line
  deficientItemId: string
): deficiencyResult {
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

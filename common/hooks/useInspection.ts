import inspectionDb, {
  DocumentResult as InspectionResult
} from '../services/firestore/inspections';
import inspectionModel from '../models/inspection';

interface Result extends InspectionResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading an inspection by id
export default function usePropertyInspections(
  firestore: any, // eslint-disable-line
  inspectionId: string
): Result {
  // No inspection payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as inspectionModel,
    handlers
  };

  // Load a single inspection
  const result = inspectionDb.findRecord(firestore, inspectionId);
  Object.assign(payload, result, { handlers });

  return payload;
}

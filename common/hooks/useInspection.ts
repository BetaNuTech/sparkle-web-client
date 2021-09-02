import { useEffect, useState } from 'react';
import inspectionDb, {
  propertyResult as inspectionResult
} from '../services/firestore/inspections';
import inspectionModel from '../models/inspection';

interface useInspectionResult extends inspectionResult {
  memo: string;
  data: any;
}

// Actions
const handlers = {};

// Hooks for loading an inspection by id
export default function usePropertyInspections(
  firestore: any, // eslint-disable-line
  inspectionId: string
): useInspectionResult {
  const [memo, setMemo] = useState('{}');

  // No inspection payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as inspectionModel,
    handlers,
    memo
  };

  // Load a single inspection
  const result = inspectionDb.findRecord(firestore, inspectionId);
  Object.assign(payload, result, { handlers });

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(payload.data);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return payload;
}

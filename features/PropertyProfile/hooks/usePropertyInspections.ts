import { useEffect, useState } from 'react';
import inspectionApi, {
  inspectionCollectionResult
} from '../../../common/services/firestore/inspections';

interface usePropertyInspectionsResult extends inspectionCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading all inspections for a property
export default function usePropertyInspections(
  firestore: any, // eslint-disable-line
  propertyId: string
): usePropertyInspectionsResult {
  const [memo, setMemo] = useState('[]');

  // No inspections payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all inspections related to single property
  const result = inspectionApi.queryByProperty(firestore, propertyId);
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

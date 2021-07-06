import { useEffect, useState } from 'react';
import propertyModel from '../models/property';
import propertiesApi, {
  propertyResult
} from '../services/firestore/properties';

interface usePropertiesResult extends propertyResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useProperties(
  firestore: any, // eslint-disable-line
  propertyId: string
): usePropertiesResult {
  const [memo, setMemo] = useState('{}');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as propertyModel,
    handlers,
    memo
  };

  const result = propertiesApi.findRecord(firestore, propertyId);
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

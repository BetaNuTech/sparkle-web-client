import { useEffect, useState } from 'react';
import propertiesDb, {
  propertiesCollectionResult
} from '../services/firestore/properties';

interface usePropertiesResult extends propertiesCollectionResult {
  memo: string;
  handlers: any;
}
// Actions
const handlers = {};

export default function useQueryProperties(
  firestore: any, // eslint-disable-line
  propertyIds: string[]
): usePropertiesResult {
  const [memo, setMemo] = useState('[]');
  const isValidReq = propertyIds.length;

  // Fix for requiring all hooks to call
  // on every render, we provide fake doc reference
  const queryIds = isValidReq ? propertyIds : ['undefined'];

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  const result = propertiesDb.queryRecords(firestore, queryIds);
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

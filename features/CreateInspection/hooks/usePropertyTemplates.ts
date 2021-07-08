import { useEffect, useState } from 'react';
import templatesApi, {
  templatesCollectionResult
} from '../../../common/services/firestore/templates';

interface usePropertyTemplatesResult extends templatesCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading all templates for a property
export default function usePropertyTemplates(
  firestore: any, // eslint-disable-line
  propertyId: string
): usePropertyTemplatesResult {
  const [memo, setMemo] = useState('[]');

  // No templates payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all templates related to single property
  const result = templatesApi.queryByProperty(firestore, propertyId);
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

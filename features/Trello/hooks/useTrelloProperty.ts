import { useEffect, useState } from 'react';
import trelloIntegrationDb, {
  trelloIntegrationResult
} from '../../../common/services/firestore/trello';
import trelloPropertyModel from '../../../common/models/trelloProperty';

interface useTrelloIntegrationResult extends trelloIntegrationResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading an inspection by id
export default function useTrelloProperty(
  firestore: any, // eslint-disable-line
  propertyId: string
): useTrelloIntegrationResult {
  const [memo, setMemo] = useState('{}');

  const payload = {
    status: 'loading',
    error: null,
    data: {} as trelloPropertyModel,
    handlers,
    memo
  };

  // Load Trello Integration for a property
  const result = trelloIntegrationDb.getPropertyIntegrationDetails(
    firestore,
    propertyId
  );

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

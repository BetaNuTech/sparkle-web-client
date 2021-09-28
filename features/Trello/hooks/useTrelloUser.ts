import { useEffect, useState } from 'react';
import trelloIntegrationDb, {
  trelloIntegrationResult
} from '../../../common/services/firestore/trello';
import trelloUserModel from '../../../common/models/trelloUser';

interface useTrelloIntegrationResult extends trelloIntegrationResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading an inspection by id
export default function useTrelloUser(
  firestore: any // eslint-disable-line
): useTrelloIntegrationResult {
  const [memo, setMemo] = useState('{}');

  const payload = {
    status: 'loading',
    error: null,
    data: {} as trelloUserModel,
    handlers,
    memo
  };

  // Load Trello user
  const result = trelloIntegrationDb.getUser(firestore);

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

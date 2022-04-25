import trelloIntegrationDb, {
  trelloUserResult
} from '../services/firestore/trello';
import TrelloIntegrationModel from '../models/trelloIntegration';

interface useTrelloIntegrationResult extends trelloUserResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading trello integration
export default function useTrelloIntegration(
  firestore: any // eslint-disable-line
): useTrelloIntegrationResult {
  const payload = {
    status: 'loading',
    error: null,
    data: {} as TrelloIntegrationModel,
    handlers
  };

  // Load Trello user
  const result = trelloIntegrationDb.getUser(firestore);

  Object.assign(payload, result, { handlers });

  return payload;
}

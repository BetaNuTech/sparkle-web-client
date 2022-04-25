import slackIntegrationDb, { SlackResult } from '../services/firestore/slack';
import SlackIntegrationModel from '../models/slackIntegration';

// Hooks for loading slack integration
export default function useSlackIntegration(
  firestore: any // eslint-disable-line
): SlackResult {
  const payload = {
    status: 'loading',
    error: null,
    data: {} as SlackIntegrationModel
  };

  // Load slack integration
  const result = slackIntegrationDb.findRecord(firestore);

  Object.assign(payload, result);

  return payload;
}

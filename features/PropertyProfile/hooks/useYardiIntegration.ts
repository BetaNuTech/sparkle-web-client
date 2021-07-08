import integrationApi, {
  yardiIntegrationResult
} from '../../../common/services/integrations';

interface useYardiIntegrationResult extends yardiIntegrationResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for check if we have yardi integration
export default function useYardiIntegration(
  firestore: any // eslint-disable-line
): useYardiIntegrationResult {
  // No integration payload
  const payload = {
    status: 'loading',
    error: null,
    data: {},
    handlers
  };

  // Check if we have yardi integration document
  const result = integrationApi.queryYardiRecord(firestore);
  Object.assign(payload, result, { handlers });

  return payload;
}

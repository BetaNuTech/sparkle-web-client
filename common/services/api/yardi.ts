import currentUser from '../../utils/currentUser';
import yardiWorkOrder from '../../models/yardi/workOrder';
import normalizeJsonApiDoc from '../../utils/api/normalizeJsonApiDoc';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: yardi:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// GET a property's work orders
const getWorkOrdersRequest = (
  authToken: string,
  propertyId: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/yardi/work-orders`, {
    method: 'GET',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

const createGetWorkOrdersApiError = createApiError(
  `${PREFIX} getWorkOrdersRequest:`,
  {
    407: 'yardi not authenticated'
  }
);

export default {
  // Request all a property's
  // work orders and normalize payload
  async getWorkOrdersRequest(propertyId: string): Promise<yardiWorkOrder[]> {
    let authToken = '';

    try {
      authToken = await currentUser.getIdToken();
    } catch (tokenErr) {
      throw Error(
        `${PREFIX} getWorkOrdersRequest: auth token could not be recovered: ${tokenErr}`
      );
    }

    let response = null;
    try {
      response = await getWorkOrdersRequest(authToken, propertyId);
    } catch (err) {
      throw Error(`${PREFIX} getWorkOrdersRequest: GET request failed: ${err}`);
    }

    // Parse payload
    let responseJson: any = {};
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(
        `${PREFIX} getWorkOrdersRequest: failed to parse JSON: ${err}`
      );
    }

    // Throw unsuccessful request
    const apiError: any = createGetWorkOrdersApiError(
      response.status,
      responseJson.errors
    );
    if (apiError) {
      throw apiError;
    }

    // Handle unexpected success payload
    if (!Array.isArray(responseJson.data)) {
      throw Error(
        `${PREFIX} getWorkOrdersRequest: unexpected success response schema`
      );
    }

    // Handle success
    return responseJson.data
      .map(normalizeJsonApiDoc)
      .map((wo) => wo as yardiWorkOrder);
  }
};

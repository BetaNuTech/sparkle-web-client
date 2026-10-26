import currentUser from '../../utils/currentUser';
import yardiWorkOrder, {
  yardiWorkOrderWritable
} from '../../models/yardi/workOrder';
import yardiCustomValues from '../../models/yardi/customValues';
import yardiResident from '../../models/yardi/resident';
import yardiOccupant from '../../models/yardi/occupant';
import normalizeJsonApiDoc from '../../utils/api/normalizeJsonApiDoc';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: yardi:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const YARDI_ERROR_MESSAGES = {
  407: 'yardi not authenticated',
  502: 'yardi could not process request'
};

export type getResidentsResponse = {
  residents: yardiResident[];
  occupants: yardiOccupant[];
};

// Supported query parameters when
// listing a property's work orders
export interface WorkOrderFilters {
  state?: 'open' | 'closed';
  unit?: string;
  resident?: string;
  status?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

const yardiUrl = (propertyId: string, path: string): string =>
  `${API_DOMAIN}/api/v0/properties/${propertyId}/yardi/${path}`;

// Convert filters to a query string
// omitting any blank values
export const toWorkOrdersQuery = (filters: WorkOrderFilters = {}): string => {
  const params = new URLSearchParams();
  Object.keys(filters)
    .filter((key) => filters[key] !== undefined && filters[key] !== '')
    .forEach((key) => params.append(key, `${filters[key]}`));
  const query = params.toString();
  return query ? `?${query}` : '';
};

const jsonHeaders = (authToken: string) => ({
  Authorization: `FB-JWT ${authToken}`,
  'Content-Type': 'application/json'
});

// GET a property's work orders
const getWorkOrdersRequest = (
  authToken: string,
  propertyId: string,
  filters: WorkOrderFilters
): Promise<Response> =>
  fetch(yardiUrl(propertyId, `work-orders${toWorkOrdersQuery(filters)}`), {
    method: 'GET',
    headers: jsonHeaders(authToken)
  });

// GET a single work order
const getWorkOrderRequest = (
  authToken: string,
  propertyId: string,
  workOrderId: string
): Promise<Response> =>
  fetch(yardiUrl(propertyId, `work-orders/${workOrderId}`), {
    method: 'GET',
    headers: jsonHeaders(authToken)
  });

// POST a new work order
const createWorkOrderRequest = (
  authToken: string,
  propertyId: string,
  workOrder: yardiWorkOrderWritable
): Promise<Response> =>
  fetch(yardiUrl(propertyId, 'work-orders'), {
    method: 'POST',
    headers: jsonHeaders(authToken),
    body: JSON.stringify(workOrder)
  });

// PATCH an existing work order
const updateWorkOrderRequest = (
  authToken: string,
  propertyId: string,
  workOrderId: string,
  updates: yardiWorkOrderWritable
): Promise<Response> =>
  fetch(yardiUrl(propertyId, `work-orders/${workOrderId}`), {
    method: 'PATCH',
    headers: jsonHeaders(authToken),
    body: JSON.stringify(updates)
  });

// GET the values Yardi accepts for a property
const getCustomValuesRequest = (
  authToken: string,
  propertyId: string
): Promise<Response> =>
  fetch(yardiUrl(propertyId, 'custom-values'), {
    method: 'GET',
    headers: jsonHeaders(authToken)
  });

// GET a property's residents
const getResidentsRequest = (
  authToken: string,
  propertyId: string
): Promise<Response> =>
  fetch(yardiUrl(propertyId, 'residents'), {
    method: 'GET',
    headers: jsonHeaders(authToken)
  });

const createGetWorkOrdersApiError = createApiError(
  `${PREFIX} getWorkOrdersRequest:`,
  YARDI_ERROR_MESSAGES
);

const createGetWorkOrderApiError = createApiError(
  `${PREFIX} getWorkOrderRequest:`,
  YARDI_ERROR_MESSAGES
);

const createCreateWorkOrderApiError = createApiError(
  `${PREFIX} createWorkOrderRequest:`,
  YARDI_ERROR_MESSAGES
);

const createUpdateWorkOrderApiError = createApiError(
  `${PREFIX} updateWorkOrderRequest:`,
  YARDI_ERROR_MESSAGES
);

const createGetCustomValuesApiError = createApiError(
  `${PREFIX} getCustomValuesRequest:`,
  YARDI_ERROR_MESSAGES
);

const createGetResidentsApiError = createApiError(
  `${PREFIX} getResidentsRequest:`,
  YARDI_ERROR_MESSAGES
);

// Recover the user's token, send the
// request, parse its JSON, and throw
// any API error.  Resolves the payload.
async function sendRequest(
  name: string,
  request: (authToken: string) => Promise<Response>,
  createError: (status: number, errors: any) => void | Error
): Promise<any> {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} ${name}: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await request(authToken);
  } catch (err) {
    throw Error(`${PREFIX} ${name}: request failed: ${err}`);
  }

  // Parse payload
  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} ${name}: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request
  const apiError: any = createError(response.status, responseJson.errors);
  if (apiError) {
    throw apiError;
  }

  return responseJson;
}

// Convert a JSON API work order
// resource into a work order model
const toWorkOrder = (doc: any): yardiWorkOrder =>
  normalizeJsonApiDoc(doc) as yardiWorkOrder;

export default {
  // Request a property's work orders,
  // optionally filtered, and normalize payload
  async getWorkOrdersRequest(
    propertyId: string,
    filters: WorkOrderFilters = {}
  ): Promise<yardiWorkOrder[]> {
    const responseJson = await sendRequest(
      'getWorkOrdersRequest',
      (authToken) => getWorkOrdersRequest(authToken, propertyId, filters),
      createGetWorkOrdersApiError
    );

    // Handle unexpected success payload
    if (!Array.isArray(responseJson.data)) {
      throw Error(
        `${PREFIX} getWorkOrdersRequest: unexpected success response schema`
      );
    }

    return responseJson.data.map(toWorkOrder);
  },

  // Request a single work order
  async getWorkOrderRequest(
    propertyId: string,
    workOrderId: string
  ): Promise<yardiWorkOrder> {
    const responseJson = await sendRequest(
      'getWorkOrderRequest',
      (authToken) => getWorkOrderRequest(authToken, propertyId, workOrderId),
      createGetWorkOrderApiError
    );

    if (!responseJson.data || !responseJson.data.id) {
      throw Error(
        `${PREFIX} getWorkOrderRequest: unexpected success response schema`
      );
    }

    return toWorkOrder(responseJson.data);
  },

  // Create a work order, resolving
  // the record Yardi stored
  async createWorkOrderRequest(
    propertyId: string,
    workOrder: yardiWorkOrderWritable
  ): Promise<yardiWorkOrder> {
    const responseJson = await sendRequest(
      'createWorkOrderRequest',
      (authToken) => createWorkOrderRequest(authToken, propertyId, workOrder),
      createCreateWorkOrderApiError
    );

    if (!responseJson.data || !responseJson.data.id) {
      throw Error(
        `${PREFIX} createWorkOrderRequest: unexpected success response schema`
      );
    }

    return toWorkOrder(responseJson.data);
  },

  // Partially update a work order,
  // resolving the record Yardi stored
  async updateWorkOrderRequest(
    propertyId: string,
    workOrderId: string,
    updates: yardiWorkOrderWritable
  ): Promise<yardiWorkOrder> {
    const responseJson = await sendRequest(
      'updateWorkOrderRequest',
      (authToken) =>
        updateWorkOrderRequest(authToken, propertyId, workOrderId, updates),
      createUpdateWorkOrderApiError
    );

    if (!responseJson.data || !responseJson.data.id) {
      throw Error(
        `${PREFIX} updateWorkOrderRequest: unexpected success response schema`
      );
    }

    return toWorkOrder(responseJson.data);
  },

  // Request the picker values Yardi
  // accepts for a property's work orders
  async getCustomValuesRequest(propertyId: string): Promise<yardiCustomValues> {
    const responseJson = await sendRequest(
      'getCustomValuesRequest',
      (authToken) => getCustomValuesRequest(authToken, propertyId),
      createGetCustomValuesApiError
    );

    const attributes =
      responseJson.data && responseJson.data.attributes
        ? responseJson.data.attributes
        : null;

    if (!attributes || !Array.isArray(attributes.statuses)) {
      throw Error(
        `${PREFIX} getCustomValuesRequest: unexpected success response schema`
      );
    }

    return {
      id: `${responseJson.data.id || ''}`,
      priorities: attributes.priorities || [],
      categories: attributes.categories || [],
      statuses: attributes.statuses || [],
      reasons: attributes.reasons || [],
      resolutions: attributes.resolutions || []
    };
  },

  // Request all a property's
  // residents, occupants, & normalize
  // the payload
  async getResidentsRequest(propertyId: string): Promise<getResidentsResponse> {
    const responseJson = await sendRequest(
      'getResidentsRequest',
      (authToken) => getResidentsRequest(authToken, propertyId),
      createGetResidentsApiError
    );

    // Handle unexpected success payload
    if (!Array.isArray(responseJson.data)) {
      throw Error(
        `${PREFIX} getResidentsRequest: unexpected success response schema`
      );
    }

    // Munge data into Yardi Residents and Occupants
    const occupantSrc = responseJson.included || [];
    const occupants: yardiOccupant[] = occupantSrc
      .map(normalizeJsonApiDoc)
      .map((occupant) => occupant as yardiOccupant);
    const residents: yardiResident[] = (responseJson.data || []).map(
      (residentData) => {
        const resident = normalizeJsonApiDoc(residentData);
        const residentsOccupants: string[] = occupantSrc
          .filter(
            (occ) =>
              occ &&
              occ.relationships &&
              occ.relationships.resident &&
              occ.relationships.resident.data &&
              occ.relationships.resident.data.id === resident.id
          )
          .map((occ) => normalizeJsonApiDoc(occ));

        // Add occupant(s) to resident
        resident.occupants = residentsOccupants;
        return resident as yardiResident;
      }
    );

    // Add resident to each occupant
    occupants.forEach((occupant) => {
      const [resident] = residents.filter((r) =>
        r.occupants.some((occ) => occ.id === occupant.id)
      );
      occupant.resident = resident ? resident.id : '';
    });
    // Handle success
    return { residents, occupants };
  }
};

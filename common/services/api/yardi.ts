import currentUser from '../../utils/currentUser';
import yardiWorkOrder from '../../models/yardi/workOrder';
import yardiResident from '../../models/yardi/resident';
import yardiOccupant from '../../models/yardi/occupant';
import normalizeJsonApiDoc from '../../utils/api/normalizeJsonApiDoc';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: yardi:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

export type getResidentsResponse = {
  residents: yardiResident[];
  occupants: yardiOccupant[];
};

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

// GET a property's residents
const getResidentsRequest = (
  authToken: string,
  propertyId: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/yardi/residents`, {
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

const createGetResidentsApiError = createApiError(
  `${PREFIX} getResidentsRequest:`,
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
  },

  // Request all a property's
  // residents, occupants, & normalize
  // the payload
  async getResidentsRequest(propertyId: string): Promise<getResidentsResponse> {
    let authToken = '';

    try {
      authToken = await currentUser.getIdToken();
    } catch (tokenErr) {
      throw Error(
        `${PREFIX} getResidentsRequest: auth token could not be recovered: ${tokenErr}`
      );
    }

    let response = null;
    try {
      response = await getResidentsRequest(authToken, propertyId);
    } catch (err) {
      throw Error(`${PREFIX} getResidentsRequest: GET request failed: ${err}`);
    }

    // Parse payload
    let responseJson: any = {};
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(
        `${PREFIX} getResidentsRequest: failed to parse JSON: ${err}`
      );
    }

    // Throw unsuccessful request
    const apiError: any = createGetResidentsApiError(
      response.status,
      responseJson.errors
    );
    if (apiError) {
      throw apiError;
    }

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
        const residentsOccupantIds: string[] = occupantSrc
          .filter(
            (occ) =>
              occ &&
              occ.relationships &&
              occ.relationships.resident &&
              occ.relationships.resident.data &&
              occ.relationships.resident.data.id === resident.id
          )
          .map((occ) => occ.id);

        // Add numeric lease unit
        // attribute for sorting
        if (resident.leaseUnit && typeof resident.leaseUnit === 'string') {
          resident.leaseUnit = parseInt(resident.leaseUnit, 10);
        }

        // Add occupant(s) to resident
        resident.occupants = residentsOccupantIds;
        return resident as yardiResident;
      }
    );

    // Add resident to each occupant
    occupants.forEach((occupant) => {
      const [resident] = residents.filter((r) =>
        r.occupants.includes(occupant.id)
      );
      occupant.resident = resident ? resident.id : '';
    });

    // Handle success
    return { residents, occupants };
  }
};

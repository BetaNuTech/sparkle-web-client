import currentUser from '../../utils/currentUser';
import inspectionModel from '../../models/inspection';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: inspections:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST a Property Request
const postRequest = (
  authToken: string,
  propertyId: string,
  body: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/inspections`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...body
    })
  });

const patchInspectionTemplateApiError = createApiError(
  `${PREFIX} updateInspectionTemplate:`
);

const createRecord = async (
  propertyId: string,
  body: Record<string, string>
): Promise<inspectionModel> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  // Send request
  let response = null;
  try {
    response = await postRequest(authToken, propertyId, body);
    if (response.status !== 201) {
      throw Error(`failed with status: ${response.status}`);
    }
  } catch (err) {
    throw Error(`${PREFIX} createRecord: POST request failed: ${err}`);
  }

  // Means inspections is created
  let json = null;
  try {
    json = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createRecord: failed to parse response: ${err}`);
  }

  // TODO throw any API errors

  // Assemble inspection
  try {
    return {
      id: json.data.id,
      ...json.data.attributes
    } as inspectionModel;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: unexpected response payload: ${err}`);
  }
};

const patchInspectionTemplateRequest = (
  authToken: string,
  inspectionId: string,
  inspectionTemplate: inspectionTemplateUpdateModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/inspections/${inspectionId}/template`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...inspectionTemplate
    })
  });

const updateInspectionTemplate = async (
  inspectionId: string,
  inspectionTemplate: inspectionTemplateUpdateModel
): Promise<inspectionModel> => {
  let authToken = '';
  let inspection: inspectionModel = null;

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateInspectionTemplate: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await patchInspectionTemplateRequest(
      authToken,
      inspectionId,
      inspectionTemplate
    );
  } catch (err) {
    throw Error(
      `${PREFIX} updateInspectionTemplate: PATCH request failed: ${err}`
    );
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(
      `${PREFIX} updateInspectionTemplate: failed to parse JSON: ${err}`
    );
  }

  // Throw unsuccessful request API error
  const apiError: any = patchInspectionTemplateApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  // Update successful
  if (response.status === 201) {
    inspection = {
      id: responseJson.data.id,
      ...responseJson.data.attributes
    } as inspectionModel;
  } else {
    // 204 status changes had no
    // impact on inspection
    inspection = {
      id: inspectionId,
      template: inspectionTemplate
    } as inspectionModel;
  }

  return inspection;
};

export default { createRecord, updateInspectionTemplate };

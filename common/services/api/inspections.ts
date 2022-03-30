import currentUser from '../../utils/currentUser';
import inspectionModel from '../../models/inspection';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';
import inspectionPhotoDataModel from '../../models/inspectionTemplateItemPhotoData';
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

const postInspectionApiError = createApiError(`${PREFIX} createRecord:`);

const patchInspectionTemplateApiError = createApiError(
  `${PREFIX} updateInspectionTemplate:`
);

const patchInspectionApiError = createApiError(`${PREFIX} updateInspection:`);

const postFileRequestApiError = createApiError(`${PREFIX} uploadPhotoData:`);

const generatePDFApiError = createApiError(`${PREFIX} generatePdfReport:`);

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
  } catch (err) {
    throw Error(`${PREFIX} createRecord: POST request failed: ${err}`);
  }

  // Parse payload
  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createRecord: failed to parse response: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = postInspectionApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  // Assemble inspection
  try {
    return {
      id: responseJson.data.id,
      ...responseJson.data.attributes
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

// POST photo data
const postFileRequest = (
  authToken: string,
  inspectionId: string,
  itemId: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(
    `${API_DOMAIN}/api/v0/inspections/${inspectionId}/template/items/${itemId}/image`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`
      },
      body: formData
    }
  );
};

// Upload a single photo
// to a target inspection item
const uploadPhotoData = async (
  inspectionId: string,
  itemId: string,
  file: File
): Promise<inspectionPhotoDataModel> => {
  let authToken = '';
  let responseJson: any = {};

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} uploadPhotoData: could not recover token: ${err}`);
  }

  let response = null;
  try {
    response = await postFileRequest(authToken, inspectionId, itemId, file);
  } catch (err) {
    throw Error(`${PREFIX} uploadPhotoData: POST request failed: ${err}`);
  }

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} uploadPhotoData: failed to parse JSON: ${err}`);
  }

  const apiError: any = postFileRequestApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  // Assemble inspection uploaded photo data
  try {
    return {
      id: responseJson.data.id,
      ...responseJson.data.attributes
    } as inspectionPhotoDataModel;
  } catch (err) {
    throw Error(
      `${PREFIX} uploadPhotoData: unexpected response payload: ${err}`
    );
  }
};

const patchInspectionPdfReportRequest = (
  authToken: string,
  inspectionId: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/inspections/${inspectionId}/report-pdf`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

const generatePdfReport = async (inspectionId: string): Promise<boolean> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} generatePdfReport: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await patchInspectionPdfReportRequest(authToken, inspectionId);
  } catch (err) {
    throw Error(`${PREFIX} generatePdfReport: PATCH request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} generatePdfReport: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = generatePDFApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return true;
};

const patchInspectionRequest = (
  authToken: string,
  inspectionId: string,
  data: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/inspections/${inspectionId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data
    })
  });

const updateInspection = async (
  inspectionId: string,
  data: Record<string, string>
): Promise<boolean> => {
  let authToken = '';
  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateInspection: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await patchInspectionRequest(authToken, inspectionId, data);
  } catch (err) {
    throw Error(`${PREFIX} updateInspection: PATCH request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateInspection: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = patchInspectionApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return true;
};

export default {
  createRecord,
  updateInspectionTemplate,
  uploadPhotoData,
  generatePdfReport,
  updateInspection
};

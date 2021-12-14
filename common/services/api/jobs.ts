import currentUser from '../../utils/currentUser';
import jobModel from '../../models/job';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: jobs:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

export type serviceResponse = {
  statusCode: number;
  body?: any;
  job?: jobModel;
};

const jobCreateApiError = createApiError(`${PREFIX} createJob:`);
const jobUpdateApiError = createApiError(`${PREFIX} updateJob:`);

// POST an Job Request
const postRequest = (
  authToken: string,
  propertyId: string,
  job: any
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...job })
  });

// PUT Job Request
const putRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  job: any
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...job
    })
  });

export const createNewJob = async (
  propertyId: string,
  job: jobModel
): Promise<jobModel> => {
  let authToken = '';
  let jobCreate: jobModel = null;
  let responseJson: any = {};

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} createNewJob: could not recover token: ${err}`);
  }

  const response = await postRequest(authToken, propertyId, job);

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createNewJob: failed to parse JSON: ${err}`);
  }

  const apiError: any = jobCreateApiError(response.status, responseJson.errors);
  if (apiError) {
    throw apiError;
  }

  if (response.status === 201) {
    jobCreate = responseJson.data.attributes as jobModel;
    jobCreate.id = responseJson.data.id;
  }

  return jobCreate;
};

export const updateJob = async (
  propertyId: string,
  jobId: string,
  job: jobModel
): Promise<jobModel> => {
  let authToken = '';
  let jobUpdate: jobModel = null;
  let responseJson: any = {};

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} updateJob: could not recover token: ${err}`);
  }

  const response = await putRequest(authToken, propertyId, jobId, job);

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateJob: failed to parse JSON: ${err}`);
  }

  const apiError: any = jobUpdateApiError(response.status, responseJson.errors);
  if (apiError) {
    throw apiError;
  }

  if (response.status === 201) {
    jobUpdate = responseJson.data.attributes as jobModel;
    jobUpdate.id = responseJson.data.id;
  }

  return jobUpdate;
};

export default { createNewJob, updateJob };

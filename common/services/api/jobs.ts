import currentUser from '../../utils/currentUser';
import jobModel from '../../models/job';
import ErrorServerInternal from '../../models/errors/serverInternal';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorBadRequest, { ErrorItem } from '../../models/errors/badRequest';

const PREFIX = 'services: api: jobs:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

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

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} createNewJob: system failure`);
  }

  if (response.status === 403) {
    throw new ErrorForbidden(`${PREFIX} createNewJob: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} createNewJob: record not found`);
  }

  if (response.status === 400) {
    const errSrvr = new ErrorBadRequest(`${PREFIX} createNewJob: fix errors`);
    errSrvr.errors = responseJson
      ? Array.isArray(responseJson.errors) &&
        responseJson.errors.map(
          (err) =>
            ({
              name: err.source && err.source.pointer,
              detail: err.detail
            } as ErrorItem)
        )
      : [];
    throw errSrvr;
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

  if (response.status === 500) {
    throw new ErrorServerInternal(`${PREFIX} updateJob: system failure`);
  }

  if (response.status === 403) {
    throw new ErrorForbidden(`${PREFIX} updateJob: user lacks permission`);
  }

  if (response.status === 404) {
    throw new ErrorNotFound(`${PREFIX} updateJob: record not found`);
  }

  if (response.status === 400) {
    const errSrvr = new ErrorBadRequest(`${PREFIX} updateJob: fix errors`);
    errSrvr.errors = responseJson
      ? Array.isArray(responseJson.errors) &&
        responseJson.errors.map(
          (err) =>
            ({
              name: err.source && err.source.pointer,
              detail: err.detail
            } as ErrorItem)
        )
      : [];
    throw errSrvr;
  }

  if (response.status === 201) {
    jobUpdate = responseJson.data.attributes as jobModel;
    jobUpdate.id = responseJson.data.id;
  }

  return jobUpdate;
};

export default { createNewJob, updateJob };

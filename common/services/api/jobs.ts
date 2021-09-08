import currentUser from '../../utils/currentUser';
import jobModel from '../../models/job';

const PREFIX = 'services: api: jobs:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST an Job Request
const postRequest = (
  authToken: string,
  propertyId: string,
  job: any
): Promise<any> =>
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
): Promise<any> =>
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
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} createNewJob: could not recover token: ${err}`);
  }

  return postRequest(authToken, propertyId, job);
};

export const updateJob = async (
  propertyId: string,
  jobId: string,
  job: jobModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} updateJob: could not recover token: ${err}`);
  }

  return putRequest(authToken, propertyId, jobId, job);
};

export default { createNewJob, updateJob };

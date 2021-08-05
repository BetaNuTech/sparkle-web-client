import currentUser from '../../utils/currentUser';
import jobModel from '../../models/job';

const PREFIX = 'services: api: jobs:';

// POST an Job Request
const postRequest = (
  authToken: string,
  propertyId: string,
  job: jobModel
): Promise<any> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: job.title,
        need: job.need,
        scopeOfWork: job.scopeOfWork,
        type: job.type
      })
    }
  );

// PUT Job Request
const putRequest = (
  authToken: string,
  propertyId: string,
  job: jobModel
): Promise<any> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs/${job.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: job.title,
        need: job.need,
        scopeOfWork: job.scopeOfWork,
        type: job.type,
        state: job.state,
        authorizedRules: job.authorizedRules,
      })
    }
  );

export const createNewJob = async (
  propertyId: string,
  job: jobModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} send: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return postRequest(authToken, propertyId, job);
};


export const updateJob = async (
  propertyId: string,
  job: jobModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} send: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return putRequest(authToken, propertyId, job);
};

export default { createNewJob, updateJob };

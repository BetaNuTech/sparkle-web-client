import currentUser from '../../utils/currentUser';
import propertyModel from '../../models/property';

const PREFIX = 'services: api: jobs:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST a Property Request
const postRequest = (
  authToken: string,
  property: propertyModel
): Promise<any> =>
  fetch(`${API_DOMAIN}/api/v0/properties`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...property
    })
  });

// PUT Property Request
const putRequest = (
  authToken: string,
  propertyId: string,
  property: propertyModel
): Promise<any> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}`, {
    method: 'PUT',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...property
    })
  });

export const createRecord = async (property: propertyModel): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  return postRequest(authToken, property);
};

export const updateRecord = async (
  propertyId: string,
  property: propertyModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  return putRequest(authToken, propertyId, property);
};

export default { createRecord, updateRecord };

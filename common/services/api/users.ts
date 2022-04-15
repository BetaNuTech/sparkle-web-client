import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';
import UserModel from '../../models/user';

const PREFIX = 'services: api: users:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateCreateError = createApiError(`${PREFIX} createRecord:`);
const generateUpdateError = createApiError(`${PREFIX} updateRecord:`);

// POST request to create user
const postUserRequest = (
  authToken: string,
  body: UserModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/users`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body })
  });

const createRecord = async (data: UserModel): Promise<UserModel> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postUserRequest(authToken, data);
  } catch (err) {
    throw Error(`${PREFIX} createRecord: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  if (response.status !== 204) {
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(`${PREFIX} createRecord: failed to parse JSON: ${err}`);
    }
  }

  // Throw unsuccessful request API error
  const apiError: any = generateCreateError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return {
    id: responseJson.data.id,
    ...responseJson.data.attributes
  };
};

// PATCH request to update user
const patchUserRequest = (
  authToken: string,
  userId: string,
  body: UserModel
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/users/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body })
  });

const updateRecord = async (
  userId: string,
  data: UserModel
): Promise<UserModel> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await patchUserRequest(authToken, userId, data);
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: PATCH request failed: ${err}`);
  }

  let responseJson: any = {};
  if (response.status !== 204) {
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(`${PREFIX} updateRecord: failed to parse JSON: ${err}`);
    }
  }

  // Throw unsuccessful request API error
  const apiError: any = generateUpdateError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return {
    id: responseJson.data.id,
    ...responseJson.data.attributes
  };
};

export default {
  createRecord,
  updateRecord
};

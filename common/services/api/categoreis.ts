import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: categories:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateCreateError = createApiError(`${PREFIX} createRecord:`);
const generateUpdateError = createApiError(`${PREFIX} updateRecord:`);

// POST a create template category request
const postCategoryRequest = (
  authToken: string,
  name: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/template-categories`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

// PATCH a update template category request
const patchCategoryRequest = (
  authToken: string,
  categoryId: string,
  name: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/template-categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });

const createRecord = async (name: string): Promise<boolean> => {
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
    response = await postCategoryRequest(authToken, name);
  } catch (err) {
    throw Error(`${PREFIX} createRecord: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createRecord: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = generateCreateError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return true;
};

const updateRecord = async (
  categoryId: string,
  name: string
): Promise<boolean> => {
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
    response = await patchCategoryRequest(authToken, categoryId, name);
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = generateUpdateError(
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
  updateRecord
};

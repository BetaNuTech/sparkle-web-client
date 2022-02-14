import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';
import DeficientItemModel from '../../models/deficientItem';
import DeficientItemCompletedPhoto from '../../models/deficientItems/deficientItemCompletedPhoto';

const PREFIX = 'services: api: deficientItems:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateTrelloCardAPIError = createApiError(
  `${PREFIX} createTrelloCard:`
);

const generateDeficientItemAPIError = createApiError(`${PREFIX} update:`);

const postFileRequestApiError = createApiError(`${PREFIX} uploadPhoto:`);

// POST a Trello card request
const postTrelloCardRequest = (
  authToken: string,
  deficiencyId: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/deficiencies/${deficiencyId}/trello/card`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

const createTrelloCard = async (deficiencyId: string): Promise<boolean> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createTrelloCard: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postTrelloCardRequest(authToken, deficiencyId);
  } catch (err) {
    throw Error(`${PREFIX} createTrelloCard: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createTrelloCard: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = generateTrelloCardAPIError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return true;
};

// Generate query params for multiple
// to update multiple deficiency items
const getIDParams = (ids: string[]) => ids.map((id) => `id=${id}`).join('&');

// Put request for deficient item
// for multiple deficiency items
const putDeficientItemRequest = (
  authToken: string,
  deficiencyIds: string[],
  updates: DeficientItemModel
): Promise<Response> =>
  fetch(
    `${API_DOMAIN}/api/v0/deficiencies/?${getIDParams(
      deficiencyIds
    )}&notify=true`,
    {
      method: 'PUT',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...updates })
    }
  );

const update = async (
  deficiencyIds: string[],
  updates: DeficientItemModel
): Promise<void> => {
  let authToken = '';
  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} update: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await putDeficientItemRequest(authToken, deficiencyIds, updates);
  } catch (err) {
    throw Error(`${PREFIX} update: PUT request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} update: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError = generateDeficientItemAPIError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    apiError as Error;
    throw apiError;
  }
};

// POST deficiencies photos
const postFileRequest = (
  authToken: string,
  deficiencyId: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${API_DOMAIN}/api/v0/deficiencies/${deficiencyId}/image`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`
    },
    body: formData
  });
};

// Upload a single photo
// to a target deficiency
const uploadPhoto = async (
  deficiencyId: string,
  file: File
): Promise<DeficientItemCompletedPhoto> => {
  let authToken = '';
  let responseJson: any = {};

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} uploadPhoto: could not recover token: ${err}`);
  }

  let response = null;
  try {
    response = await postFileRequest(authToken, deficiencyId, file);
  } catch (err) {
    throw Error(`${PREFIX} uploadPhoto: POST request failed: ${err}`);
  }

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} uploadPhoto: failed to parse JSON: ${err}`);
  }

  const apiError: any = postFileRequestApiError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  // Assemble deficiency uploaded photo data
  try {
    return {
      id: responseJson.data.id,
      ...responseJson.data.attributes
    } as DeficientItemCompletedPhoto;
  } catch (err) {
    throw Error(`${PREFIX} uploadPhoto: unexpected response payload: ${err}`);
  }
};

export default {
  createTrelloCard,
  update,
  uploadPhoto
};

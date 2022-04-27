import SlackIntegration from '../../models/slackIntegration';
import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: slack:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateAuthorizeError = createApiError(`${PREFIX} authorize:`);
const generateDeleteAuhtorizationError = createApiError(
  `${PREFIX} deleteAuthorization:`
);
const generateUpdateError = createApiError(`${PREFIX} update:`);

// POST request to authorize slack
const postAuthorizeRequest = (
  authToken: string,
  body: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/integrations/slack/authorization`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body })
  });

// Request to authorize slack
const createAuthorization = async (
  data: Record<string, string>
): Promise<SlackIntegration> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createAuthorization: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postAuthorizeRequest(authToken, data);
  } catch (err) {
    throw Error(`${PREFIX} createAuthorization: request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createAuthorization: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = generateAuthorizeError(
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

// DELETE request to remove slack authorization
const deleteAuthorizeRequest = (authToken: string): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/integrations/slack/authorization`, {
    method: 'DELETE',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

// Request to delete slack authorization
const deleteAuthorization = async (): Promise<boolean> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} deleteAuthorization: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await deleteAuthorizeRequest(authToken);
  } catch (err) {
    throw Error(`${PREFIX} deleteAuthorization: DELETE request failed: ${err}`);
  }

  let responseJson: any = {};
  if (response.status !== 204) {
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(
        `${PREFIX} deleteAuthorization: failed to parse JSON: ${err}`
      );
    }
  }

  // Throw unsuccessful request API error
  const apiError: any = generateDeleteAuhtorizationError(
    response.status,
    responseJson.errors
  );
  if (apiError) {
    throw apiError;
  }

  return true;
};

// PATCH request to authorize slack
const patchSlackRequest = (
  authToken: string,
  body: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/integrations/slack/authorization`, {
    method: 'PATCH',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...body })
  });

// Request to update slack integration detail
const updateAuthorization = async (
  data: Record<string, string>
): Promise<SlackIntegration> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} updateAuthorization: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await patchSlackRequest(authToken, data);
  } catch (err) {
    throw Error(`${PREFIX} updateAuthorization: request failed: ${err}`);
  }

  let responseJson: any = {};
  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateAuthorization: failed to parse JSON: ${err}`);
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
  createAuthorization,
  deleteAuthorization,
  updateAuthorization
};

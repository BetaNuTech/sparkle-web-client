import SlackIntegration from '../../models/slackIntegration';
import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: slack:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateAuthorizeError = createApiError(`${PREFIX} authorize:`);
const generateDeleteAuhtorizationError = createApiError(
  `${PREFIX} deleteAuthorization:`
);

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
const authorize = async (
  data: Record<string, string>
): Promise<SlackIntegration> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} authorize: auth token could not be recovered: ${tokenErr}`
    );
  }

  let response = null;
  try {
    response = await postAuthorizeRequest(authToken, data);
  } catch (err) {
    throw Error(`${PREFIX} authorize: POST request failed: ${err}`);
  }

  let responseJson: any = {};
  if (response.status !== 204) {
    try {
      responseJson = await response.json();
    } catch (err) {
      throw Error(`${PREFIX} authorize: failed to parse JSON: ${err}`);
    }
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

export default {
  authorize,
  deleteAuthorization
};

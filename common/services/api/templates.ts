import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: templates:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateCreateError = createApiError(`${PREFIX} create:`);

const getParams = (templateId?: string) =>
  templateId ? `?clone=${templateId}` : '';
// POST a create template card request
const postCreateTemplateRequest = (
  authToken: string,
  templateId?: string
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/templates${getParams(templateId)}`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

const createRecord = async (templateId?: string): Promise<string> => {
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
    response = await postCreateTemplateRequest(authToken, templateId);
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

  return responseJson.data.id;
};

export default {
  createRecord
};

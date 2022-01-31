import currentUser from '../../utils/currentUser';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: deficientItems:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

const generateTrelloCardAPIError = createApiError(
  `${PREFIX} createTrelloCard:`
);

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

export default {
  createTrelloCard
};

import currentUser from '../../utils/currentUser';
import inspectionModel from '../../models/inspection';

const PREFIX = 'services: api: inspections:';
const API_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN;

// POST a Property Request
const postRequest = (
  authToken: string,
  propertyId: string,
  body: Record<string, string>
): Promise<Response> =>
  fetch(`${API_DOMAIN}/api/v0/properties/${propertyId}/inspections`, {
    method: 'POST',
    headers: {
      Authorization: `FB-JWT ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...body
    })
  });

export const createRecord = async (
  propertyId: string,
  body: Record<string, string>
): Promise<inspectionModel> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    throw Error(
      `${PREFIX} createRecord: auth token could not be recovered: ${tokenErr}`
    );
  }

  // Send request
  let response = null;
  try {
    response = await postRequest(authToken, propertyId, body);
    if (response.status !== 201) {
      throw Error(`failed with status: ${response.status}`);
    }
  } catch (err) {
    throw Error(`${PREFIX} createRecord: POST request failed: ${err}`);
  }

  // Means inspections is created
  let json = null;
  try {
    json = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createRecord: failed to parse response: ${err}`);
  }

  // Assemble inspection
  try {
    return {
      id: json.data.id,
      ...json.data.attributes
    } as inspectionModel;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: unexpected response payload: ${err}`);
  }
};

export default { createRecord };

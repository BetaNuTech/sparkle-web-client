import currentUser from '../../utils/currentUser';
import bidModel from '../../models/bid';
import createApiError from '../../utils/api/createError';

const PREFIX = 'services: api: bids:';

const bidUpdateApiError = createApiError(`${PREFIX} updateBid:`);
const bidCreateApiError = createApiError(`${PREFIX} updateBid:`);

// POST an Bid Request
const postRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  bid: bidModel
): Promise<Response> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs/${jobId}/bids`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bid)
    }
  );

// PUT Bid Request
const putRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  bidId: string,
  bid: bidModel
): Promise<Response> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs/${jobId}/bids/${bidId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bid)
    }
  );

export const createNewBid = async (
  propertyId: string,
  jobId: string,
  bid: bidModel
): Promise<bidModel> => {
  let authToken = '';
  let bidCreate: bidModel = null;
  let responseJson: any = {};

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} createNewBid: could not recover token: ${err}`);
  }

  let response = null;
  try {
    response = await postRequest(authToken, propertyId, jobId, bid);
  } catch (err) {
    throw Error(`${PREFIX} createNewBid: unexpected request error: ${err}`);
  }

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} createNewBid: failed to parse JSON: ${err}`);
  }
  // Throw unsuccessful request API error
  const apiError: any = bidCreateApiError(response.status, responseJson.errors);

  if (apiError) {
    throw apiError;
  }

  if (response.status === 201) {
    bidCreate = responseJson.data.attributes as bidModel;
    bidCreate.id = responseJson.data.id;
  }
  return bidCreate;
};

export const updateBid = async (
  propertyId: string,
  jobId: string,
  bidId: string,
  bid: bidModel
): Promise<bidModel> => {
  let authToken = '';
  let bidUpdate: bidModel = null;
  let responseJson: any = {};
  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} updateBid: could not recover token: ${err}`);
  }

  let response = null;
  try {
    response = await putRequest(authToken, propertyId, jobId, bidId, bid);
  } catch (err) {
    throw Error(`${PREFIX} updateBid: unexpected request error: ${err}`);
  }

  try {
    responseJson = await response.json();
  } catch (err) {
    throw Error(`${PREFIX} updateBid: failed to parse JSON: ${err}`);
  }

  // Throw unsuccessful request API error
  const apiError: any = bidUpdateApiError(response.status, responseJson.errors);

  if (apiError) {
    throw apiError;
  }

  if (response.status === 201) {
    bidUpdate = responseJson.data.attributes as bidModel;
    bidUpdate.id = responseJson.data.id;
  }
  return bidUpdate;
};

export default { createNewBid, updateBid };

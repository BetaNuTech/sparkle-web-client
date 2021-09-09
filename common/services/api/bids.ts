import currentUser from '../../utils/currentUser';
import bidModel from '../../models/bid';

const PREFIX = 'services: api: bids:';

// POST an Bid Request
const postRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  bid: any
): Promise<any> =>
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
  bid: any
): Promise<any> =>
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
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} createNewBid: could not recover token: ${err}`);
  }

  return postRequest(authToken, propertyId, jobId, bid);
};

export const updateBid = async (
  propertyId: string,
  jobId: string,
  bidId: string,
  bid: bidModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (err) {
    throw Error(`${PREFIX} updateBid: could not recover token: ${err}`);
  }

  return putRequest(authToken, propertyId, jobId, bidId, bid);
};

export default { createNewBid, updateBid };

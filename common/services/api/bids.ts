import currentUser from '../../utils/currentUser';
import bidModel from '../../models/bid';

const PREFIX = 'services: api: bids:';

// POST an Bid Request
const postRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  bid: bidModel
): Promise<any> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs/${jobId}/bids`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vendor: bid.vendor,
        vendorDetails: bid.vendorDetails,
        costMin: bid.costMin,
        costMax: bid.costMax,
        startAt: bid.startAt,
        completeAt: bid.completeAt
      })
    }
  );

// PUT Bid Request
const putRequest = (
  authToken: string,
  propertyId: string,
  jobId: string,
  bid: bidModel
): Promise<any> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/properties/${propertyId}/jobs/${jobId}/bids/${bid.id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vendor: bid.vendor,
        vendorDetails: bid.vendorDetails,
        costMin: bid.costMin,
        costMax: bid.costMax,
        startAt: bid.startAt,
        scope: bid.scope,
        completeAt: bid.completeAt,
        state: bid.state
      })
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
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} send: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return postRequest(authToken, propertyId, jobId, bid);
};

export const updateBid = async (
  propertyId: string,
  jobId: string,
  bid: bidModel
): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} send: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return putRequest(authToken, propertyId, jobId, bid);
};

export default { createNewBid, updateBid };

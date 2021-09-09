import { useState } from 'react';
import bidsApi from '../../../common/services/api/bids';
import bidModel from '../../../common/models/bid';

const PREFIX = 'features: EditBid: hooks: useBidForm:';
export interface BidApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

interface useBidFormResult {
  apiState: BidApiResult;
  postBidCreate(propertyId: string, jobId: string, bid: bidModel): void;
  putBidUpdate(propertyId: string, jobId: string, bidId: string, bid: bidModel): void;
  error: Error;
}

export default function useBidForm(bidApi: bidModel): useBidFormResult {
  const [apiState, setApiState] = useState({
    isLoading: false,
    statusCode: 0,
    response: null,
    bid: JSON.stringify(bidApi)
  });

  const [error, setError] = useState(null);

  const postBidCreate = async (
    propertyId: string,
    jobId: string,
    bid: bidModel
  ) => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null,
      bid: JSON.stringify(bid)
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await bidsApi.createNewBid(propertyId, jobId, bid);
    } catch (err) {
      setError(Error(`${PREFIX} postBidCreate: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} postBidCreate: failed to parse JSON: ${err}`));
    }

    setApiState({
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json,
      bid: JSON.stringify(bid)
    });
  };

  const putBidUpdate = async (
    propertyId: string,
    jobId: string,
    bidId: string,
    bid: bidModel
  ) => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null,
      bid: JSON.stringify(bid)
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await bidsApi.updateBid(propertyId, jobId, bidId, bid);
    } catch (err) {
      setError(Error(`${PREFIX} putBidUpdate: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} putBidUpdate: failed to parse JSON: ${err}`));
    }

    setApiState({
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json,
      bid: JSON.stringify(bid)
    });
  };

  if (
    !apiState.isLoading &&
    apiState.statusCode !== 400 &&
    apiState.bid !== JSON.stringify(bidApi)
  ) {
    setApiState({
      isLoading: false,
      statusCode: 0,
      response: null,
      bid: JSON.stringify(bidApi)
    });
  }

  return { apiState, postBidCreate, putBidUpdate, error };
}

import { useState } from 'react';
import Router from 'next/router';
import bidsApi from '../../../common/services/api/bids';
import bidModel from '../../../common/models/bid';
import errorReports from '../../../common/services/api/errorReports';

const PREFIX = 'features: EditBid: hooks: useBidForm:';
export interface BidApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

interface useBidFormResult {
  apiState: BidApiResult;
  postBidCreate(propertyId: string, jobId: string, bid: bidModel): void;
  putBidUpdate(
    propertyId: string,
    jobId: string,
    bidId: string,
    bid: bidModel
  ): void;
  error: Error;
}

type userNotifications = (message: string, options?: any) => any;

export default function useBidForm(
  bidApi: bidModel,
  sendNotification: userNotifications
): useBidFormResult {
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
    let wrappedErr = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await bidsApi.createNewBid(propertyId, jobId, bid);
    } catch (err) {
      wrappedErr = Error(`${PREFIX} postBidCreate: request failed: ${err}`);
      setError(wrappedErr);
    }

    const statusCode: number = res && res.status ? res.status : 0;

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      wrappedErr = Error(
        `${PREFIX} postBidCreate: failed to parse JSON: ${err}`
      );
      setError(wrappedErr);
    }

    // Send success notification and redirect to update form
    if (statusCode === 201 && json && json.data && json.data.id) {
      sendNotification('Created the bid successfully', {
        type: 'success'
      });
      Router.push(
        `/properties/${propertyId}/jobs/${jobId}/bids/${json.data.id}/`
      );
    }

    // Send permissions error notification
    if (statusCode === 403) {
      sendNotification('You are not allowed to create this bid.', {
        type: 'error'
      });
    }

    // Send server error notification & report
    if (statusCode === 500) {
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // eslint-disable-next-line
      errorReports.send(wrappedErr);
    }

    setApiState({
      statusCode,
      isLoading: false,
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
    let wrappedErr = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await bidsApi.updateBid(propertyId, jobId, bidId, bid);
    } catch (err) {
      wrappedErr = Error(`${PREFIX} putBidUpdate: request failed: ${err}`);
      setError(wrappedErr);
    }

    const statusCode: number = res && res.status ? res.status : 0;

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      wrappedErr = Error(
        `${PREFIX} putBidUpdate: failed to parse response JSON: ${err}`
      );
      setError(wrappedErr);
    }

    // Send success notification
    if (statusCode === 201 && json && json.data && json.data.attributes) {
      sendNotification(`${json.data.attributes.vendor} successfully updated`, {
        type: 'success'
      });
    }

    // Send unfound error and redirect
    if (statusCode === 404) {
      sendNotification('Bid does not exist.', {
        type: 'error'
      });
      Router.push(`/properties/${propertyId}/jobs/${jobId}/bids/`);
    }

    // Send permissions error notification
    if (statusCode === 403) {
      sendNotification('You are not allowed to update this bid.', {
        type: 'error'
      });
    }

    // Send update conflict error notification
    if (statusCode === 409) {
      sendNotification('Could not update bid, please try again.', {
        type: 'error'
      });
    }

    // Send server error notification & report
    if (statusCode === 500) {
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // eslint-disable-next-line
      errorReports.send(wrappedErr);
    }

    setApiState({
      statusCode,
      isLoading: false,
      response: json,
      bid: JSON.stringify(bid)
    });
  };

  if (
    !apiState.isLoading &&
    ![400, 409].includes(apiState.statusCode) &&
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

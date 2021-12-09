import { useState } from 'react';
import Router from 'next/router';
import bidsApi from '../../../common/services/api/bids';
import bidModel from '../../../common/models/bid';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';

import ErrorBadRequest, {
  BadRequestItem
} from '../../../common/models/errors/badRequest';

const PREFIX = 'features: EditBid: hooks: useBidForm:';

interface useBidFormResult {
  postBidCreate(propertyId: string, jobId: string, bid: bidModel): void;
  putBidUpdate(
    propertyId: string,
    jobId: string,
    bidId: string,
    bid: bidModel
  ): void;
  onPublish(
    data: bidModel,
    propertyId: string,
    jobId: string,
    bidId: string,
    action: string,
    isNewBid: boolean
  ): void;
  errors: BadRequestItem[];
  isLoading: boolean;
  formFieldsError: Record<string, any>;
  generalFormErrors: Array<string>;
  bid: bidModel;
}

type userNotifications = (message: string, options?: any) => any;

export default function useBidForm(
  bidApi: bidModel,
  sendNotification: userNotifications
): useBidFormResult {
  const [formState, setFormState] = useState({
    isLoading: false,
    bid: null
  });

  const [errors, setErrors] = useState<BadRequestItem[]>([]);

  const handleSuccessResponse = (
    bidId: string,
    propertyId: string,
    jobId: string,
    bid: bidModel
  ) => {
    // Show success notification for creating or updating a bid
    sendNotification(
      bidId === 'new'
        ? 'Create the bid successfully'
        : `${bid.vendor} successfully updated`,
      {
        type: 'success'
      }
    );
    if (bidId === 'new' && bid) {
      Router.push(`/properties/${propertyId}/jobs/${jobId}/bids/${bid.id}/`);
    }
  };

  const handleErrorResponse = (apiError: Error, bidId: string) => {
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to create or update job
      sendNotification(
        `You are not allowed to ${
          bidId === 'new' ? 'create' : 'update'
        } this bid.`,
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorBadRequest) {
      setErrors(apiError.errors);
    } else {
      // User not allowed to create or update inspection
      sendNotification(
        'Unexpected error. Please try again, or contact an admin.',
        {
          type: 'error'
        }
      );
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${apiError}`);
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const postBidCreate = async (
    propertyId: string,
    jobId: string,
    bid: bidModel
  ) => {
    setFormState({
      isLoading: true,
      bid: null
    });
    setErrors([]);

    let bidCreate: bidModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      bidCreate = await bidsApi.createNewBid(propertyId, jobId, bid);
      handleSuccessResponse('new', propertyId, jobId, bidCreate);
    } catch (err) {
      handleErrorResponse(err, 'new');
    }
    setFormState({
      isLoading: false,
      bid: bidCreate
    });
  };

  const putBidUpdate = async (
    propertyId: string,
    jobId: string,
    bidId: string,
    bid: bidModel
  ) => {
    setFormState({
      isLoading: true,
      bid: null
    });
    setErrors([]);
    let bidUpdate: bidModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      bidUpdate = await bidsApi.updateBid(propertyId, jobId, bidId, bid);
      handleSuccessResponse(bidId, propertyId, jobId, bidUpdate);
    } catch (err) {
      handleErrorResponse(err, 'new');
    }

    setFormState({
      isLoading: false,
      bid: bidUpdate
    });
  };

  const onPublish = (data, propertyId, jobId, bidId, action, isNewBid) => {
    const formBid = {
      ...data
    } as bidModel;

    switch (action) {
      case 'approved':
      case 'rejected':
      case 'incomplete':
      case 'complete':
        formBid.state = action;
        break;
      case 'reopen':
        formBid.state = 'open';
        break;
      default:
        break;
    }

    if (isNewBid) {
      // Create bid request
      postBidCreate(propertyId, jobId, formBid);
    } else {
      // Update existing bid
      putBidUpdate(propertyId, jobId, bidId, formBid);
    }
  };

  const formInputs = [
    'vendor',
    'costMin',
    'costMax',
    'startAt',
    'completeAt',
    'vendorW9',
    'vendorInsurance',
    'vendorLicense'
  ];
  // Error object which can be there after submitting form
  const formFieldsError = {
    vendor: '',
    costMin: '',
    costMax: '',
    startAt: '',
    completeAt: '',
    vendorW9: '',
    vendorInsurance: '',
    vendorLicense: ''
  };

  // Check if we have error then find all defined keys in @formInput variable
  // Otherwise push in @filteredApiErrors to show them in list of errors
  const filteredApiErrors = [];
  if (errors) {
    errors.forEach((errData) => {
      if (errData.name && formInputs.includes(errData.name)) {
        formFieldsError[errData.name] = errData.detail;
      } else {
        filteredApiErrors.push(errData);
      }
    });
  }
  // Extract the message
  const generalFormErrors =
    errors.length > 0 ? errors.map((e) => e.detail) : [];
  return {
    isLoading: formState.isLoading,
    bid: formState.bid,
    postBidCreate,
    putBidUpdate,
    onPublish,
    errors,
    formFieldsError,
    generalFormErrors
  };
}

import Router from 'next/router';
import errorReports from '../../../common/services/api/errorReports';
import { BidApiResult } from './useBidForm';

const PREFIX = 'features: bidEdit: hooks: useBidStatus:';

type userNotifications = (message: string, options?: any) => any;

export default function useBidStatus(
  apiState: BidApiResult,
  bidId: string,
  jobId: string,
  propertyId: string,
  sendNotification: userNotifications
): void {
  switch (apiState.statusCode) {
    case 403:
      // User not allowed to create or update bid
      sendNotification(
        `You are not allowed to ${
          bidId === 'new' ? 'create' : 'update'
        } this bid.`,
        { type: 'error' }
      );
      break;
    case 409:
      // Update fails due to conflict
      sendNotification('Could not update bid, please try again.', {
        type: 'error'
      });
      break;
    case 500:
      // User not allowed to create or update bid
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete bid create/update operation`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      break;
    case 201:
      // Show success notification for creting or updating a property
      sendNotification(
        bidId === 'new'
          ? 'Created the bid successfully'
          : `${apiState.response.data.attributes.vendor} successfully updated`,
        {
          type: 'success'
        }
      );
      if (bidId === 'new' && apiState.response && apiState.response.data) {
        Router.push(
          `/properties/${propertyId}/jobs/${jobId}/bids/${apiState.response.data.id}/`
        );
      }
      break;
    default:
      break;
  }
}

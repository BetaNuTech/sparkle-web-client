import Router from 'next/router';
import errorReports from '../../../common/services/api/errorReports';
import { JobApiResult } from './useJobForm';

const PREFIX = 'features: jobEdit: hooks: useJobStatus:';

type userNotifications = (message: string, options?: any) => any;

export default function useJobForm(
  apiState: JobApiResult,
  jobId: string,
  propertyId: string,
  sendNotification: userNotifications
): void {
  switch (apiState.statusCode) {
    case 403:
      // User not allowed to create or update job
      sendNotification(
        `You are not allowed to ${
          jobId === 'new' ? 'create' : 'update'
        } this job.`,
        { type: 'error' }
      );
      break;
    case 500:
      // User not allowed to create or update job
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete job create/update operation`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      break;
    case 201:
      // Show success notification for creting or updating a property
      sendNotification(
        jobId === 'new'
          ? 'Create the job successfully'
          : `${apiState.response.data.attributes.title} successfully updated`,
        {
          type: 'success'
        }
      );
      if (jobId === 'new' && apiState.response && apiState.response.data) {
        Router.push(
          `/properties/${propertyId}/jobs/edit/${apiState.response.data.id}/`
        );
      }
      break;
    default:
      break;
  }
}

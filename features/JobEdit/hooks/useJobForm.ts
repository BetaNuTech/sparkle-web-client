import { useState } from 'react';
import Router from 'next/router';
import jobsApi from '../../../common/services/api/jobs';
import jobModel from '../../../common/models/job';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorBadRequest from '../../../common/models/errors/badRequest';

const PREFIX = 'features: EditJob: hooks: useJobForm:';
interface useJobFormResult {
  isLoading: boolean;
  job?: jobModel;
  postJobCreate(propertyId: string, job: jobModel): void;
  putJobUpdate(propertyId: string, jobId: string, job: jobModel): void;
  error: ErrorBadRequest;
}

type userNotifications = (message: string, options?: any) => any;

export default function useJobForm(
  sendNotification: userNotifications
): useJobFormResult {
  const [formState, setFormState] = useState({
    isLoading: false,
    job: null
  });

  const [error, setError] = useState<ErrorBadRequest>(null);

  const handleSuccessResponse = (
    jobId: string,
    propertyId: string,
    job: jobModel
  ) => {
    // Show success notification for creting or updating a property
    sendNotification(
      jobId === 'new'
        ? 'Create the job successfully'
        : `${job.title} successfully updated`,
      {
        type: 'success'
      }
    );
    if (jobId === 'new' && job) {
      Router.push(`/properties/${propertyId}/jobs/edit/${job.id}/`);
    }
  };

  const handleErrorResponse = (apiError: Error, jobId: string) => {
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to create or update job
      sendNotification(
        `You are not allowed to ${
          jobId === 'new' ? 'create' : 'update'
        } this job.`,
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorServerInternal) {
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
    }
  };

  const postJobCreate = async (propertyId: string, job: jobModel) => {
    setFormState({
      isLoading: true,
      job: null
    });

    let jobCreate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobCreate = await jobsApi.createNewJob(propertyId, job);

      handleSuccessResponse('new', propertyId, jobCreate);
    } catch (err) {
      handleErrorResponse(err, 'new');
      if (err instanceof ErrorBadRequest) {
        setError(err);
      }
    }

    setFormState({
      isLoading: false,
      job: jobCreate
    });
  };

  const putJobUpdate = async (
    propertyId: string,
    jobId: string,
    job: jobModel
  ) => {
    setFormState({
      isLoading: true,
      job: null
    });

    let jobUpdate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobUpdate = await jobsApi.updateJob(propertyId, jobId, job);

      handleSuccessResponse(jobId, propertyId, jobUpdate);
    } catch (err) {
      handleErrorResponse(err, 'new');
      if (err instanceof ErrorBadRequest) {
        setError(err);
      }
    }

    setFormState({
      isLoading: false,
      job: jobUpdate
    });
  };

  return {
    isLoading: formState.isLoading,
    job: formState.job,
    postJobCreate,
    putJobUpdate,
    error
  };
}

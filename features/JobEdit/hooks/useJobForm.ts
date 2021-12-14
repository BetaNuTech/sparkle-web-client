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
  onPublish(
    data: jobModel,
    isNewJob: boolean,
    propertyId: string,
    jobId: string,
    action: string
  ): void;
  generalFormErrors: Array<string>;
}

type userNotifications = (message: string, options?: any) => any;

export default function useJobForm(
  sendNotification: userNotifications
): useJobFormResult {
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState(null);

  const [error, setError] = useState<ErrorBadRequest>(null);

  const handleSuccessResponse = (
    jobId: string,
    propertyId: string,
    jobData: jobModel
  ) => {
    // Show success notification for creting or updating a property
    sendNotification(
      jobId === 'new'
        ? 'Create the job successfully'
        : `${jobData.title} successfully updated`,
      {
        type: 'success'
      }
    );
    if (jobId === 'new' && jobData) {
      Router.push(`/properties/${propertyId}/jobs/edit/${jobData.id}/`);
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

  const postJobCreate = async (propertyId: string, jobData: jobModel) => {
    setIsLoading(true);
    setJob(null);

    let jobCreate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobCreate = await jobsApi.createNewJob(propertyId, jobData);

      handleSuccessResponse('new', propertyId, jobCreate);
    } catch (err) {
      handleErrorResponse(err, 'new');
      if (err instanceof ErrorBadRequest) {
        setError(err);
      }
    }

    setIsLoading(false);
    setJob(jobCreate);
  };

  const putJobUpdate = async (
    propertyId: string,
    jobId: string,
    jobData: jobModel
  ) => {
    setIsLoading(true);
    setJob(null);

    let jobUpdate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobUpdate = await jobsApi.updateJob(propertyId, jobId, jobData);

      handleSuccessResponse(jobId, propertyId, jobUpdate);
    } catch (err) {
      handleErrorResponse(err, 'new');
      if (err instanceof ErrorBadRequest) {
        setError(err);
      }
    }

    setIsLoading(false);
    setJob(jobUpdate);
  };

  // Publish Job updates to API
  const onPublish = (
    data: jobModel,
    isNewJob: boolean,
    propertyId: string,
    jobId: string,
    action: string
  ) => {
    const formJob = {
      ...data
    } as jobModel;

    switch (action) {
      case 'approved':
        formJob.state = 'approved';
        break;
      case 'authorized':
        formJob.state = 'authorized';
        break;
      case 'expedite':
        formJob.authorizedRules = 'expedite';
        break;
      default:
        break;
    }

    if (!isNewJob) {
      // Update request
      putJobUpdate(propertyId, jobId, formJob);
    } else {
      // Save request
      postJobCreate(propertyId, formJob);
    }
  };

  const generalFormErrors =
    error && error.errors ? error.errors.map((e) => e.detail) : [];

  return {
    isLoading,
    job,
    postJobCreate,
    putJobUpdate,
    onPublish,
    generalFormErrors
  };
}

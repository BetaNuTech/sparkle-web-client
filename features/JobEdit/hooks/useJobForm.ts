import { useState } from 'react';
import Router from 'next/router';
import { UseFormGetValues, UseFormTrigger, FormState } from 'react-hook-form';
import { diff } from 'deep-object-diff';

import jobsApi from '../../../common/services/api/jobs';
import jobModel from '../../../common/models/job';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import FormInputs from '../Form/FormInputs';

const PREFIX = 'features: EditJob: hooks: useJobForm:';
interface useJobFormResult {
  isLoading: boolean;
  job?: jobModel;
  generalFormErrors: Array<string>;
  onSubmit(action: string): void;
}

type userNotifications = (message: string, options?: any) => any;

export default function useJobForm(
  sendNotification: userNotifications,
  isNewJob: boolean,
  triggerFormValidation: UseFormTrigger<FormInputs>,
  getFormValues: UseFormGetValues<FormInputs>,
  formState: FormState<FormInputs>,
  currentJob: jobModel // published/remote job state
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

  const postJobCreate = async (jobData: jobModel) => {
    setIsLoading(true);
    setJob(null);

    let jobCreate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobCreate = await jobsApi.createNewJob(currentJob.property, jobData);

      handleSuccessResponse('new', currentJob.property, jobCreate);
    } catch (err) {
      handleErrorResponse(err, 'new');
      if (err instanceof ErrorBadRequest) {
        setError(err);
      }
    }

    setIsLoading(false);
    setJob(jobCreate);
  };

  const putJobUpdate = async (jobData: jobModel) => {
    setIsLoading(true);
    setJob(null);

    let jobUpdate: jobModel = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      jobUpdate = await jobsApi.updateJob(
        currentJob.property,
        currentJob.id,
        jobData
      );

      handleSuccessResponse(currentJob.id, currentJob.property, jobUpdate);
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
      putJobUpdate(formJob);
    } else {
      // Save request
      postJobCreate(formJob);
    }
  };

  const onSubmit = async (action: string) => {
    // Check if form is valid
    await triggerFormValidation();
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    if (hasErrors) return;

    const formData = getFormValues();
    const difference: jobModel = diff(currentJob, formData) as jobModel;

    // Check if it is an expedite request
    if (action === 'expedite') {
      // eslint-disable-next-line no-alert
      const expediteReason = window.prompt('Expedite Reason');

      if (!expediteReason) {
        return;
      }
      difference.expediteReason = expediteReason;
    }

    // Make request to api call
    onPublish(difference, action);
  };

  const generalFormErrors =
    error && error.errors ? error.errors.map((e) => e.detail) : [];

  return {
    isLoading,
    job,
    generalFormErrors,
    onSubmit
  };
}

import { useState } from 'react';
import jobsApi from '../../../common/services/api/jobs';
import jobModel from '../../../common/models/job';

const PREFIX = 'features: EditJob: hooks: useJobForm:';
export interface JobApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

interface useJobFormResult {
  apiState: JobApiResult;
  postJobCreate(propertyId: string, job: jobModel): void;
  putJobUpdate(propertyId: string, jobId: string, job: jobModel): void;
  error: Error;
}

export default function useJobForm(jobApi: jobModel): useJobFormResult {
  const [apiState, setApiState] = useState({
    isLoading: false,
    statusCode: 0,
    response: null,
    job: JSON.stringify(jobApi)
  });

  const [error, setError] = useState(null);

  const postJobCreate = async (propertyId: string, job: jobModel) => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null,
      job: JSON.stringify(job)
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await jobsApi.createNewJob(propertyId, job);
    } catch (err) {
      setError(Error(`${PREFIX} postJobCreate: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} postJobCreate: failed to parse JSON: ${err}`));
    }

    setApiState({
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json,
      job: JSON.stringify(job)
    });
  };

  const putJobUpdate = async (propertyId: string, jobId: string, job: jobModel) => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null,
      job: JSON.stringify(job)
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await jobsApi.updateJob(propertyId, jobId, job);
    } catch (err) {
      setError(Error(`${PREFIX} putJobUpdate: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} putJobUpdate: failed to parse JSON: ${err}`));
    }

    setApiState({
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json,
      job: JSON.stringify(job)
    });
  };

  if (
    !apiState.isLoading &&
    apiState.statusCode !== 400 &&
    apiState.job !== JSON.stringify(jobApi)
  ) {
    setApiState({
      isLoading: false,
      statusCode: 0,
      response: null,
      job: JSON.stringify(jobApi)
    });
  }

  return { apiState, postJobCreate, putJobUpdate, error };
}

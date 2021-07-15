import { useEffect, useState } from 'react';
import jobsApi, {
  jobCollectionResult
} from '../../../common/services/firestore/jobs';

interface usePropertyJobsResult extends jobCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading all jobs for a property
export default function usePropertyJobs(
  firestore: any, // eslint-disable-line
  propertyId: string
): usePropertyJobsResult {
  const [memo, setMemo] = useState('[]');

  // No jobs payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all jobs related to single property
  const result = jobsApi.queryByProperty(firestore, propertyId);
  Object.assign(payload, result, { handlers });

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(payload.data);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return payload;
}

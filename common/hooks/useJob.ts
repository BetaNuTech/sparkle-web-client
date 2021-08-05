import { useEffect, useState } from 'react';
import jobModel from '../models/job';
import jobsApi, { jobResult } from '../services/firestore/jobs';

interface useJobResult extends jobResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading job record by job id
export default function useJobRecord(
  firestore: any, // eslint-disable-line
  jobId: string
): useJobResult {
  const [memo, setMemo] = useState('{}');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as jobModel,
    handlers,
    memo
  };

  const result = jobsApi.findRecord(firestore, jobId);

  if (jobId === 'new') {
    Object.assign(payload, { data: {}, status: 'success', error: null }, { handlers });
  } else {
    Object.assign(payload, result, { handlers });
  }

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

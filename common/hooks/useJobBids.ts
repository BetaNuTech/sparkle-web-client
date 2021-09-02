import { useEffect, useState } from 'react';
import bidsDb, { bidsCollectionResult } from '../services/firestore/bids';

interface useJobsBidsResult extends bidsCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading all jobs for a property
export default function useJobsBids(
  firestore: any, // eslint-disable-line
  jobId: string
): useJobsBidsResult {
  const [memo, setMemo] = useState('[]');

  // No jobs payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all bids related to single job
  const result = bidsDb.queryByJob(firestore, jobId);
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

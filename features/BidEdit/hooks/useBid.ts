import { useEffect, useState } from 'react';
import bidModel from '../../../common/models/bid';
import bidsApi, { bidResult } from '../../../common/services/firestore/bids';

interface useBidResult extends bidResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading job record by job id
export default function useJobRecord(
  firestore: any, // eslint-disable-line
  bidId: string
): useBidResult {
  const [memo, setMemo] = useState('{}');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as bidModel,
    handlers,
    memo
  };

  const result = bidsApi.findRecord(firestore, bidId);

  if (bidId === 'new') {
    Object.assign(
      payload,
      { data: {}, status: 'success', error: null },
      { handlers }
    );
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

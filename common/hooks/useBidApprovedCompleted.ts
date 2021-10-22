import { useEffect, useState } from 'react';
import bidModel from '../models/bid';

interface useBidApprovedCompletedResult {
  approvedCompletedBid: bidModel;
}

// Hooks for finding approved or compelted bid
export default function useBidApprovedCompleted(
  bids: Array<bidModel>
): useBidApprovedCompletedResult {
  const [memo, setMemo] = useState('{}');

  const completeBids = bids.filter((b) => b.state === 'complete');
  const approvedBids =
    completeBids.length === 0 ? bids.filter((b) => b.state === 'approved') : [];

  let approvedCompletedBid = null as bidModel;

  if (completeBids.length) {
    approvedCompletedBid = completeBids[0] as bidModel;
  } else if (approvedBids.length) {
    approvedCompletedBid = approvedBids[0] as bidModel;
  }

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(approvedCompletedBid);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return { approvedCompletedBid };
}

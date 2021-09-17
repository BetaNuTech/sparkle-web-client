import { useEffect, useState } from 'react';
import bidModel from '../../../common/models/bid';
import globalEvents from '../../../common/utils/globalEvents';
import { sortBid, sortBidMobile } from '../utils/bidSorting';

export const useSortBy = (defaultSort = 'vendor'): Array<any> => {
  const [sortBy, setSortBy] = useState(defaultSort);
  return [sortBy, setSortBy];
};

export const useSortDir = (defaultDir = 'desc'): Array<any> => {
  const [sortDir, setSortDir] = useState(defaultDir);
  return [sortDir, setSortDir];
};

interface useBidSortResult {
  sortedBids: Array<bidModel>;
  sortDir: string;
  sortBy: string;
  onSortChange(sortKey: string): void;
}

// Hooks for filtering jobs list
export default function useJobSort(
  bids: Array<bidModel>,
  isMobileorTablet: boolean
): useBidSortResult {
  const [memo, setMemo] = useState('[]');
  const [sortDir, setSortDir] = useSortDir();
  const [sortBy, setSortBy] = useSortBy();

  // Set sort attribute & direction
  const onSortChange = (sortKey: string) => {
    // Update sort direction
    if (sortKey === sortBy) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey); // Update sort by
      setSortDir('desc');
    }

    globalEvents.trigger('visibilityForceCheck');
  };

  const sortedBids = isMobileorTablet
    ? [...bids].sort(sortBidMobile())
    : [...bids].sort(sortBid(sortBy, sortDir));

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sortedBids);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sortedBids,
    sortDir,
    sortBy,
    onSortChange
  };
}

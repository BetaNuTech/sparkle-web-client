import { useEffect, useState } from 'react';
import jobModel from '../../../common/models/job';
import globalEvents from '../../../common/utils/globalEvents';
import { sortJob, nextJobSort } from '../utils/jobSorting';

export const useSortBy = (defaultSort = 'title'): Array<any> => {
  const [sortBy, setSortBy] = useState(defaultSort);
  return [sortBy, setSortBy];
};

export const useSortDir = (defaultDir = 'asc'): Array<any> => {
  const [sortDir, setSortDir] = useState(defaultDir);
  return [sortDir, setSortDir];
};

interface useJobSortResult {
  sortedJobs: Array<jobModel>;
  sortDir: string;
  sortBy: string;
  onMobileSortChange(): void;
  onSortChange(sortKey: string): void;
}

// Hooks for filtering jobs list
export default function useJobSort(
  searchKey: string,
  filteredJobs: Array<jobModel>,
  jobs: Array<jobModel>
): useJobSortResult {
  const [memo, setMemo] = useState('[]');
  const [sortDir, setSortDir] = useSortDir();
  const [sortBy, setSortBy] = useSortBy();

  const onMobileSortChange = () => {
    const activeSortValue = nextJobSort(sortBy);
    const descOrderKeys = ['createdAt', 'updatedAt'];
    const isDescOrderValue = descOrderKeys.includes(activeSortValue);

    // Check if sort direction is asc then
    // change to desc if it is either createdAt or updatedAt
    if (isDescOrderValue && sortDir === 'asc') {
      setSortDir('desc');
    } else if (!isDescOrderValue && sortDir === 'desc') {
      // If sort desc and it is other than values
      // in `descOrderKeys` then change to asc
      setSortDir('asc');
    }
    // Update inspection sort
    setSortBy(activeSortValue);
    globalEvents.trigger('visibilityForceCheck');
  };

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

  const sortedJobs =
    filteredJobs.length > 0 || searchKey
      ? [...filteredJobs].sort(sortJob(sortBy, sortDir))
      : [...jobs].sort(sortJob(sortBy, sortDir));

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sortedJobs);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sortedJobs,
    sortDir,
    sortBy,
    onMobileSortChange,
    onSortChange
  };
}

import { useEffect, useState } from 'react';
import inspectionModel from '../../../common/models/inspection';
import {
  sortInspection,
  nextInspectionsSort
} from '../utils/inspectionSorting';

export const useSortBy = (defaultSort = 'creationDate'): Array<any> => {
  const [sortBy, setSortBy] = useState(defaultSort);
  return [sortBy, setSortBy];
};

export const useSortDir = (defaultDir = 'desc'): Array<any> => {
  const [sortDir, setSortDir] = useState(defaultDir);
  return [sortDir, setSortDir];
};

interface useInspectionSortResult {
  sortedInspections: Array<inspectionModel>;
  sortDir: string;
  sortBy: string;
  onMobileSortChange(): void;
  onSortChange(sortKey: string): void;
}

// Hooks for filtering inspections list
export default function useInspectionSort(
  inspectionFilter: string,
  filteredInspections: Array<inspectionModel>,
  inspections: Array<inspectionModel>
): useInspectionSortResult {
  const [memo, setMemo] = useState('[]');
  const [sortDir, setSortDir] = useSortDir();
  const [sortBy, setSortBy] = useSortBy();

  const onMobileSortChange = () => {
    const activeSortValue = nextInspectionsSort(sortBy);
    const descOrderKeys = ['creationDate', 'updatedAt', 'score'];
    const isDescOrderValue = descOrderKeys.includes(activeSortValue);

    // Check if sort direction is asc then
    // change to desc if it is either creationDate or updatedAt or score
    if (isDescOrderValue && sortDir === 'asc') {
      setSortDir('desc');
    } else if (!isDescOrderValue && sortDir === 'desc') {
      // If sort desc and it is other than values
      // in `descOrderKeys` then change to asc
      setSortDir('asc');
    }
    // Update inspection sort
    setSortBy(activeSortValue);
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
  };

  const sortedInspections =
    filteredInspections.length > 0 || inspectionFilter
      ? [...filteredInspections].sort(sortInspection(sortBy, sortDir))
      : [...inspections].sort(sortInspection(sortBy, sortDir));

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sortedInspections);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sortedInspections,
    sortDir,
    sortBy,
    onMobileSortChange,
    onSortChange
  };
}

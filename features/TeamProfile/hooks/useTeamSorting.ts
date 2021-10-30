import { useEffect, useState } from 'react';
import propertyModel from '../../../common/models/property';
import globalEvents from '../../../common/utils/globalEvents';
import {
  sorts,
  sortProperties
} from '../../Properties/utils/propertiesSorting';

export const useSortBy = (defaultSort = 'name'): Array<any> => {
  const [sortBy, setSortBy] = useState(defaultSort);
  return [sortBy, setSortBy];
};

export const useSortDir = (defaultDir = 'asc'): Array<any> => {
  const [sortDir, setSortDir] = useState(defaultDir);
  return [sortDir, setSortDir];
};

interface useTeamSortingResult {
  sortedProperties: Array<propertyModel>;
  sortDir: string;
  sortBy: string;
  nextPropertiesSort: () => void;
  onSortChange(sortKey: string): void;
}

// Hooks for filtering jobs list
export default function useTeamSorting(
  filteredProperties: Array<propertyModel>,
  propertiesMemo: string
): useTeamSortingResult {
  const [memo, setMemo] = useState('[]');
  const [sortBy, setSortBy] = useSortBy();
  const [sortDir, setSortDir] = useSortDir();

  const [sortedProperties, setSortedProperties] = useState([]);

  // Apply properties sort order
  const applyPropertiesSort = () =>
    [...filteredProperties].sort(sortProperties(sortBy, sortDir));

  useEffect(() => {
    function resortProperties() {
      setSortedProperties(applyPropertiesSort());
    }

    resortProperties();
  }, [propertiesMemo, sortBy, sortDir]); // eslint-disable-line

  // Loop through property
  // sorting options
  const nextPropertiesSort = () => {
    const activeSortValue = sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first
    const descOrderKeys = ['lastInspectionDate', 'lastInspectionScore'];
    const isDescOrderValue = descOrderKeys.includes(activeSortValue);

    // Check if sort direction is asc then
    // change to desc if it is either lastInspectionDate or lastInspectionScore
    if (isDescOrderValue && sortDir === 'asc') {
      setSortDir('desc');
    } else if (!isDescOrderValue && sortDir === 'desc') {
      // If sort desc and it is other than values
      // in `descOrderKeys` then change to asc
      setSortDir('asc');
    }
    // Update Property sort
    setSortBy(activeSortValue);
    globalEvents.trigger('visibilityForceCheck');
  };

  // Set sort attribute & direction
  const onSortChange = (key: string) => (evt: { target: HTMLInputElement }) => {
    const {
      target: { value }
    } = evt;

    // Update sort direction
    if (key === 'sortDir') {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value); // Update sort by
    }

    globalEvents.trigger('visibilityForceCheck');
  };

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sortedProperties);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    sortedProperties,
    sortDir,
    sortBy,
    nextPropertiesSort,
    onSortChange
  };
}

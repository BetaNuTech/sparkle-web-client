import { useEffect, useState } from 'react';
import propertyModel from '../../models/property';
import globalEvents from '../../utils/globalEvents';

interface usePropertiesSorting {
  sortedProperties: propertyModel[];
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextPropertiesSort: (customSortBy?: string) => void;
  onSortChange(sortKey: string): void;
}

const PREFIX = 'common: hooks: properties: useSorting:';

// Selectable inspection sorts
export const SORTS = [
  'name',
  'city',
  'state',
  'lastInspectionDate',
  'lastInspectionScore'
];

const SORT_TYPES = {
  name: 'string',
  city: 'string',
  state: 'string',
  lastInspectionDate: 'number',
  lastInspectionScore: 'number'
};

if (!SORTS.every((s) => SORT_TYPES[s])) {
  throw Error(`${PREFIX} not all sorts have a type set`);
}

// User friendly names
const USER_FRIENDLY_SORT_NAMES = {
  lastInspectionDate: 'Last Entry Date',
  lastInspectionScore: 'Last Entry Score'
};

const MOBILE_AUTO_SORT_DESC = ['lastInspectionDate', 'lastInspectionScore'];

// Hooks for filtering jobs list
export default function useTeamSorting(
  filteredProperties: propertyModel[],
  propertiesMemo: string
): usePropertiesSorting {
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [sortDir, setSortDir] = useState('asc');
  const [userFacingSortBy, setUserFacingSortBy] = useState(
    toUserFacingActiveSort(sortBy)
  );
  const [sortedProperties, setSortedProperties] = useState(filteredProperties);

  // Apply properties sort order
  const applyPropertiesSort = () =>
    [...filteredProperties].sort(sortProperties(sortBy, sortDir));

  // Reset sorted properties when sort by,
  // sort direction, or filtered properties change
  // TODO replace usage of properties memo
  useEffect(() => {
    function resortProperties() {
      setSortedProperties(applyPropertiesSort());
    }

    resortProperties();
  }, [propertiesMemo, sortBy, sortDir]); // eslint-disable-line

  // Loop property sorting options
  const nextPropertiesSort = (customSortBy?: string) => {
    const activeSort =
      customSortBy || SORTS[SORTS.indexOf(sortBy) + 1] || SORTS[0]; // Get next or first
    const isDescDir = MOBILE_AUTO_SORT_DESC.includes(activeSort);
    const needsAutoSortDesc = isDescDir && sortDir === 'asc';
    const needsAutoSortAsc = !isDescDir && sortDir === 'desc';

    // Update sort direction if needed
    if (needsAutoSortDesc) {
      setSortDir('desc');
    } else if (needsAutoSortAsc) {
      setSortDir('asc');
    }

    // Update Property sort
    setSortBy(activeSort);
    setUserFacingSortBy(toUserFacingActiveSort(activeSort));
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
      setSortBy(value);
      setUserFacingSortBy(toUserFacingActiveSort(value));
    }

    globalEvents.trigger('visibilityForceCheck');
  };

  return {
    sortedProperties,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextPropertiesSort,
    onSortChange
  };
}

// Custom sort for filter + direction
export function sortProperties(key: string, sortDir: string) {
  return (a: propertyModel, b: propertyModel): number => {
    let aValue = a[key];
    let bValue = b[key];
    const isString = SORT_TYPES[key] === 'string';
    const isNumber = SORT_TYPES[key] === 'number';

    // Fallback for undefined values
    if (isNumber && !aValue) aValue = 0;
    if (isNumber && !bValue) bValue = 0;
    if (isString && !aValue) aValue = '';
    if (isString && !bValue) bValue = '';

    // Sort ascending strings
    if (sortDir === 'asc' && isString) {
      return aValue.localeCompare(bValue);
    }

    // Sort ascending numbers
    if (sortDir === 'asc') {
      if (aValue > bValue) return 1;
      if (bValue > aValue) return -1;
      return 0;
    }

    // Sort ascending strings
    if (isString) {
      return bValue.localeCompare(aValue);
    }

    // Sort descending numbers
    if (aValue > bValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };
}

// User facing name of filter
export function toUserFacingActiveSort(activeSort: string): string {
  return (
    USER_FRIENDLY_SORT_NAMES[activeSort] ||
    activeSort
      .split(' ')
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
      .join(' ')
  );
}

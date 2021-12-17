import { useEffect, useState } from 'react';
import workOrdersModel from '../../../common/models/yardi/workOrder';
import globalEvents from '../../../common/utils/globalEvents';

interface result {
  sortedWorkOrders: workOrdersModel[];
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextWorkOrdersSort: () => void;
}

const PREFIX = 'common: hooks: workOrders: useSorting:';

// Selectable inspection sorts
export const SORTS = ['createdAt:asc', 'createdAt:desc', 'updatedAt:desc'];

const SORT_TYPES = {
  createdAt: 'number',
  updatedAt: 'number'
};

if (!SORTS.map((s) => s.split(':')[0]).every((s) => SORT_TYPES[s])) {
  throw Error(`${PREFIX} not all sorts have a type set`);
}

// User friendly names
const USER_FRIENDLY_SORT_NAMES = {
  createdAt: 'Creation Date',
  updatedAt: 'Last Update'
};

// Hooks for filtering Work Orders
export default function useWorkOrdersSorting(
  filteredWorkOrders: workOrdersModel[]
): result {
  const [initialSort, initialDir] = SORTS[0].split(':');
  const [sortBy, setSortBy] = useState(initialSort);
  const [sortDir, setSortDir] = useState(initialDir);
  const [userFacingSortBy, setUserFacingSortBy] = useState(
    toUserFacingActiveSort(sortBy, sortDir)
  );

  const [sortedWorkOrders, setSortedWorkOrders] = useState(filteredWorkOrders);

  // Apply Work Orders sort order
  const applyWorkOrdersSort = () =>
    [...filteredWorkOrders].sort(sortWorkOrders(sortBy, sortDir));

  useEffect(() => {
    function resortWorkOrders() {
      setSortedWorkOrders(applyWorkOrdersSort());
    }

    resortWorkOrders();
  }, [sortBy, sortDir]); // eslint-disable-line

  // Loop property sorting options
  const nextWorkOrdersSort = () => {
    const activeSortSrc =
      SORTS[SORTS.indexOf(`${sortBy}:${sortDir}`) + 1] || SORTS[0]; // Get next or first
    const [activeSort, activeSortDir] = activeSortSrc.split(':');

    setSortBy(activeSort);
    setSortDir(activeSortDir);
    setUserFacingSortBy(toUserFacingActiveSort(activeSort, activeSortDir)); // update sort label
    globalEvents.trigger('visibilityForceCheck');
  };

  return {
    sortedWorkOrders,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextWorkOrdersSort
  };
}

// Custom sort for filter + direction
export function sortWorkOrders(key: string, sortDir: string) {
  return (a: workOrdersModel, b: workOrdersModel): number => {
    let aValue = a[key];
    let bValue = b[key];
    const isString = SORT_TYPES[key] === 'string';
    const isNumber = SORT_TYPES[key] === 'number';

    // Fallback for falsy values (sort to end)
    const defaultNum = sortDir === 'asc' ? Infinity : 0;
    const defaultStr = sortDir === 'asc' ? 'zzz' : 'aaa';
    if (isNumber) aValue = parseFloat(aValue || defaultNum);
    if (isNumber) bValue = parseFloat(bValue || defaultNum);
    if (isString) aValue = `${aValue || defaultStr}`;
    if (isString) bValue = `${bValue || defaultStr}`;

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
export function toUserFacingActiveSort(
  activeSort: string,
  activeDir: string
): string {
  const name =
    USER_FRIENDLY_SORT_NAMES[activeSort] ||
    activeSort
      .split(' ')
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
      .join(' ');

  let description = '';
  if (activeSort === 'createdAt') {
    description = `(${activeDir === 'asc' ? 'Oldest' : 'Newest'})`;
  }

  return `${name} ${description}`.trim();
}

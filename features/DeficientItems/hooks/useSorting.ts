import { ChangeEvent, useEffect, useState } from 'react';
import DeficientItem from '../../../common/models/deficientItem';
import globalEvents from '../../../common/utils/globalEvents';
import inspectionConfig from '../../../config/inspections';

const INSPECTION_SCORES = inspectionConfig.inspectionScores;

interface useSortingModel {
  sortedDeficientItems: DeficientItem[];
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextDeficientItemSort: (customSortBy?: string) => void;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
}

const PREFIX = 'features: DeficientItems: hooks: useSorting:';

// Selectable deficient item sorts
export const SORTS = [
  'updatedAt',
  'currentResponsibilityGroup',
  'finalDueDate',
  'grade',
  'createdAt'
];

const SORT_TYPES = {
  updatedAt: 'number',
  currentResponsibilityGroup: 'string',
  finalDueDate: 'number',
  grade: 'nubmer',
  createdAt: 'number'
};

if (!SORTS.every((s) => SORT_TYPES[s])) {
  throw Error(`${PREFIX} not all sorts have a type set`);
}

// User friendly names
const USER_FRIENDLY_SORT_NAMES = {
  updatedAt: 'Last Updated',
  createdAt: 'Deficient Date',
  currentResponsibilityGroup: 'Responsibility Group',
  finalDueDate: 'Due/Deferred Date',
  grade: 'Grade'
};

const MOBILE_AUTO_SORT_DESC = ['grade'];

// Hooks for sorting Deficient Items
export default function useSorting(
  deficientItems: DeficientItem[],
  sortDirection?: string
): useSortingModel {
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [sortDir, setSortDir] = useState(sortDirection || 'asc');
  const [userFacingSortBy, setUserFacingSortBy] = useState(
    toUserFacingActiveSort(sortBy)
  );
  const [sortedDeficientItems, setSortedDeficientItems] =
    useState(deficientItems);
  // Apply deficient items sort order
  const applyDeficientItemSort = () =>
    [...deficientItems].sort(sortDeficientItem(sortBy, sortDir));

  // Reset sorted deficient items when sort by,
  // sort direction, or deficient items change
  useEffect(() => {
    function resortDeficientItem() {
      setSortedDeficientItems(applyDeficientItemSort());
    }

    resortDeficientItem();
  }, [sortBy, sortDir]); // eslint-disable-line

  // Loop deficient item sorting options
  const nextDeficientItemSort = (customSortBy?: string) => {
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

    // Update deficient item sort
    setSortBy(activeSort);
    setUserFacingSortBy(toUserFacingActiveSort(activeSort));
    globalEvents.trigger('visibilityForceCheck');
  };

  // Set sort attribute & direction
  const onSortChange = (evt: { target: HTMLSelectElement }) => {
    const {
      target: { value }
    } = evt;

    setSortBy(value);
    setUserFacingSortBy(toUserFacingActiveSort(value));

    globalEvents.trigger('visibilityForceCheck');
  };

  const onSortDirChange = () => {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    globalEvents.trigger('visibilityForceCheck');
  };
  return {
    sortedDeficientItems,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextDeficientItemSort,
    onSortChange,
    onSortDirChange
  };
}

// Custom sort for filter + direction
export function sortDeficientItem(key: string, sortDir: string) {
  return (a: DeficientItem, b: DeficientItem): number => {
    let aValue = a[key];
    let bValue = b[key];
    if (key === 'finalDueDate') {
      aValue = a.currentDueDate || a.currentDeferredDate;
      bValue = b.currentDueDate || b.currentDeferredDate;
    }

    if (key === 'grade') {
      aValue = getGrade(
        a.itemScore,
        a.itemMainInputType,
        a.itemMainInputSelection
      );
      bValue = getGrade(
        b.itemScore,
        b.itemMainInputType,
        b.itemMainInputSelection
      );
    }

    const isString = SORT_TYPES[key] === 'string';
    const isNumber = SORT_TYPES[key] === 'number';

    // Fallback for undefined values
    if (isNumber && !aValue) aValue = 0;
    if (isNumber && !bValue) bValue = 0;
    if (isString && !aValue) aValue = 'z';
    if (isString && !bValue) bValue = 'z';

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

const getGrade = (
  itemScore: number,
  itemMainInputType: string,
  itemMainInputSelection: number
): number => {
  if (typeof itemScore === 'number') {
    return itemScore;
  }

  const itemScores =
    INSPECTION_SCORES[(itemMainInputType || '').toLowerCase()] || {};
  return typeof itemScores[itemMainInputSelection] === 'number'
    ? itemScores[itemMainInputSelection]
    : -1;
};

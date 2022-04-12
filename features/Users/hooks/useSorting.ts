import { useEffect, useState } from 'react';
import UserModel from '../../../common/models/user';
import globalEvents from '../../../common/utils/globalEvents';
import { getLevelName } from '../../../common/utils/userPermissions';
import { sortOptions } from '../settings';

interface useSortingModel {
  sortedUsers: UserModel[];
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextUserSort: (customSortBy?: string) => void;
  onSortChange(evt: any): void;
  onSortDirChange(): void;
}

const SORTS = sortOptions.map(({ value }) => value);
const SORT_TYPES = sortOptions.reduce((acc, opt) => {
  acc[opt.value] = opt.type;
  return acc;
}, {});
const USER_FRIENDLY_SORT_NAMES = sortOptions.reduce((acc, opt) => {
  acc[opt.value] = opt.label;
  return acc;
}, {});
const MOBILE_AUTO_SORT_DESC = ['createdAt', 'lastSignInDate'];

// Hooks for sorting Deficient Items
export default function useSorting(users: UserModel[]): useSortingModel {
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [sortDir, setSortDir] = useState('asc');
  const [userFacingSortBy, setUserFacingSortBy] = useState(
    USER_FRIENDLY_SORT_NAMES[sortBy]
  );
  const [sortedUsers, setSortedUsers] = useState(users);
  // Apply users sort order
  const applyUserSort = () => [...users].sort(sortUser(sortBy, sortDir));

  // Reset sorted users when sort by,
  // sort direction, or users change
  useEffect(() => {
    function resortUser() {
      setSortedUsers(applyUserSort());
    }

    resortUser();
  }, [sortBy, sortDir, users]); // eslint-disable-line

  // Loop deficient item sorting options
  const nextUserSort = () => {
    const activeSort = SORTS[SORTS.indexOf(sortBy) + 1] || SORTS[0]; // Get next or first
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
    setUserFacingSortBy(USER_FRIENDLY_SORT_NAMES[activeSort]);
    globalEvents.trigger('visibilityForceCheck');
  };

  // Set sort attribute & direction
  const onSortChange = (evt: { target: any }) => {
    const {
      target: { value }
    } = evt;

    setSortBy(value);
    setUserFacingSortBy(USER_FRIENDLY_SORT_NAMES[value]);

    globalEvents.trigger('visibilityForceCheck');
  };

  const onSortDirChange = () => {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    globalEvents.trigger('visibilityForceCheck');
  };

  return {
    sortedUsers,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextUserSort,
    onSortChange,
    onSortDirChange
  };
}

// Custom sort for filter + direction
export function sortUser(key: string, sortDir: string) {
  return (a: UserModel, b: UserModel): number => {
    let aValue = a[key];
    let bValue = b[key];

    if (key === 'accessLevel') {
      aValue = getLevelName(a, true);
      bValue = getLevelName(b, true);
    }

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

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import useSearching from '../../../common/hooks/useSearching';
import ResidentModel from '../../../common/models/yardi/resident';
import globalEvents from '../../../common/utils/globalEvents';
import search from '../../../common/utils/search';

const queryAttrs = [
  'email',
  'eviction',
  'firstName',
  'homeNumber',
  'lastName',
  'lastNote',
  'leaseFrom',
  'leaseSqFt',
  'leaseTo',
  'leaseUnit',
  'middleName',
  'mobileNumber',
  'moveIn',
  'paymentPlan',
  'paymentPlanDelinquent',
  'status',
  'totalCharges',
  'totalOwed',
  'yardiStatus',
  'sortLeaseUnit',
  'sortLeaseUnit'
];

interface useSearchingAndSortingModel {
  sortedResidents: ResidentModel[];
  sortDir: string;
  sortBy: string;
  userFacingSortBy: string;
  nextResidentsSort: (customSortBy?: string) => void;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  searchValue: string;
  onClearSearch(): void;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  filteredResidents: ResidentModel[];
  onFilterByStatus(evt: ChangeEvent<HTMLSelectElement>): void;
  onNextResidentFilterByStatus(): void;
  activeFilter: string;
}

const PREFIX = 'features: PropertyResidents: hooks: useSearchingAndSorting:';

// Selectable residents sorts
export const SORTS = [
  'leaseUnit',
  'id',
  'firstName',
  'lastName',
  'yardiStatus'
];

const SORT_TYPES = {
  leaseUnit: 'number',
  id: 'string',
  firstName: 'string',
  lastName: 'string',
  yardiStatus: 'string'
};

if (!SORTS.every((s) => SORT_TYPES[s])) {
  throw Error(`${PREFIX} not all sorts have a type set`);
}

// User friendly names
const USER_FRIENDLY_SORT_NAMES = {
  leaseUnit: 'Unit',
  id: 'Resident ID',
  firstName: 'Resident First Name',
  lastName: 'Resident Last Name',
  yardiStatus: 'Current Status'
};

const MOBILE_AUTO_SORT_DESC = ['yardiStatus'];

const FILTER_ORDER = [
  'all',
  'current',
  'future',
  'eviction',
  'notice',
  'vacant'
];

// Hooks for sorting residents
export default function useSearchingAndSorting(
  residents: ResidentModel[],
  sortDirection?: string
): useSearchingAndSortingModel {
  const [sortBy, setSortBy] = useState(SORTS[0]);
  const [sortDir, setSortDir] = useState(sortDirection || 'asc');
  const [userFacingSortBy, setUserFacingSortBy] = useState(
    toUserFacingActiveSort(sortBy)
  );
  const [sortedResidents, setSortedResidents] = useState(residents);
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter residents by status
  const residentsByStatus = useMemo(() => {
    if (activeFilter === 'all') {
      return sortedResidents;
    }
    return sortedResidents.filter(
      (resident) => resident.yardiStatus === activeFilter
    );
  }, [activeFilter, sortedResidents]);

  // create indexes for resident's occupant
  const residentsForFilter = residentsByStatus.map((resident) => {
    const indexes = search.createSearchIndex(
      resident.occupants || [],
      queryAttrs
    );

    return { ...resident, occupantsString: Object.values(indexes).join(' ') };
  });

  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(residentsForFilter, [...queryAttrs, 'occupantsString']);

  const filteredResidents = filteredItems.map((item) => item as ResidentModel);

  // Apply residents  sort order
  const applyResidentsSort = () =>
    [...residents].sort(sortResidents(sortBy, sortDir));

  // Reset sorted residents  when sort by,
  // sort direction, or residents  change
  useEffect(() => {
    function resortResidents() {
      setSortedResidents(applyResidentsSort());
    }

    resortResidents();
  }, [sortBy, sortDir, residents]); // eslint-disable-line

  // Loop residents  sorting options
  const nextResidentsSort = () => {
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

    // Update residents sort
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

  const onFilterByStatus = (evt: { target: HTMLSelectElement }) => {
    const {
      target: { value }
    } = evt;

    setActiveFilter(value);
  };

  const onNextResidentFilterByStatus = () => {
    const nextFilter =
      FILTER_ORDER[FILTER_ORDER.indexOf(activeFilter) + 1] || FILTER_ORDER[0]; // Get next or first
    setActiveFilter(nextFilter);
  };

  return {
    sortedResidents,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextResidentsSort,
    onSortChange,
    onSortDirChange,
    searchValue,
    onClearSearch,
    onSearchKeyDown,
    filteredResidents,
    onFilterByStatus,
    onNextResidentFilterByStatus,
    activeFilter
  };
}

// Custom sort for filter + direction
export function sortResidents(key: string, sortDir: string) {
  return (a: ResidentModel, b: ResidentModel): number => {
    let aValue = a[key];
    let bValue = b[key];
    if (key === 'leaseUnit') {
      aValue = parseInt(a.leaseUnit, 10) || 0;
      bValue = parseInt(b.leaseUnit, 10) || 0;
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

// User facing name of filter
const toUserFacingActiveSort = (activeSort: string): string =>
  USER_FRIENDLY_SORT_NAMES[activeSort];

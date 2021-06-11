// Selectable inspection sorts
export const sorts = [
  'name',
  'city',
  'state',
  'lastInspectionDate',
  'lastInspectionScore'
];

// User friendly names
const sortNames = {
  lastInspectionDate: 'Last Entry Date',
  lastInspectionScore: 'Last Entry Score'
};

// Custom sort for filter + direction
export const sortProperties = (key, sortDir) => (a, b) => {
  const aValue = a[key];
  const bValue = b[key];
  const isString = typeof aValue === 'string';

  if (sortDir === 'asc' && isString) {
    return aValue.localeCompare(bValue);
  }

  if (sortDir === 'asc') {
    if (aValue > bValue) return 1;
    if (bValue > aValue) return -1;
    return 0;
  }

  // Descending logic

  if (isString) {
    return bValue.localeCompare(aValue);
  }

  if (aValue > bValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
};

// User facing name of filter
export function activePropertiesSortFilter(activeSort) {
  return (
    sortNames[activeSort] ||
    activeSort
      .split(' ')
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
      .join(' ')
  );
}

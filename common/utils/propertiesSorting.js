// Selectable inspection filters
export const filters = [
  'name',
  'city',
  'state',
  'lastInspectionDate',
  'lastInspectionScore'
];

// Custom sort for filter + direction
export const sortProperties = (key, orderBy) => (a, b) => {
  if (orderBy === 'asc') {
    if (a[key] > b[key]) return 1;
    if (b[key] > a[key]) return -1;
    return 0;
  }

  if (a[key] > b[key]) return -1;
  if (b[key] > a[key]) return 1;
  return 0;
};

// User facing name of filter
export function activePropertiesSortFilter(activeFilter) {
  if (activeFilter === 'lastInspectionDate') {
    return 'Last Entry Date';
  }
  if (activeFilter === 'lastInspectionScore') {
    return 'Last Entry Score';
  }
  // Decamelize & titlize
  return activeFilter
    .split(' ')
    .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
    .join(' ');
}

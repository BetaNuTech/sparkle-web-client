// Selectable inspection sorts
export const sorts = [
  'creationDate',
  'updatedAt',
  'score',
  'inspectorName',
  'templateName'
];

// User friendly names
const sortNames = {
  creationDate: 'Creation Date',
  updatedAt: 'Updated At',
  inspectorName: 'Inspector Name',
  templateName: 'Template Name'
};

// Custom sort for filter + direction
// eslint-disable-next-line
export const sortInspection =
  (key: string, sortDir: string) =>
  // eslint-disable-next-line
  (a, b): number => {
    const aValue = a[key];
    const bValue = b[key];
    const isString = typeof aValue === 'string';

    const emptyKeys = ['inspectorName', 'templateName', 'templateCategory'];
    if (sortDir === 'asc' && isString) {
      // Return 1 if aValue is empty
      if (emptyKeys.includes(key) && !aValue) {
        return 1;
      }
      // Return -1 if bValue is empty
      if (emptyKeys.includes(key) && !bValue) {
        return -1;
      }
      return aValue.localeCompare(bValue);
    }

    if (sortDir === 'asc') {
      if (aValue > bValue) return 1;
      if (bValue > aValue) return -1;
      return 0;
    }

    // Descending logic

    if (isString) {
      if (emptyKeys.includes(key) && !bValue) {
        return -1;
      }
      return bValue.localeCompare(aValue);
    }

    if (aValue > bValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

// User facing name of filter
export const activeInspectionSortFilter = (activeSort: string): string =>
  sortNames[activeSort] ||
  activeSort
    .split(' ')
    .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
    .join(' ');

export const nextInspectionsSort = (sortBy: string): string =>
  sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first

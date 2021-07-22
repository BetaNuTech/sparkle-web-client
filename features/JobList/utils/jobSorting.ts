// Selectable job sorts
export const sorts = ['title', 'updatedAt', 'createdAt', 'type'];

// User friendly names
const sortNames = {
  createdAt: 'Created At',
  updatedAt: 'Updated At'
};

// Custom sort for filter + direction
// eslint-disable-next-line
export const sortJob =
  (key: string, sortDir: string) =>
  // eslint-disable-next-line
  (a, b): number => {
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
export const activeJobSortFilter = (activeSort: string): string =>
  sortNames[activeSort] ||
  activeSort
    .split(' ')
    .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1).toLowerCase()}`)
    .join(' ');

export const nextJobSort = (sortBy: string): string =>
  sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first

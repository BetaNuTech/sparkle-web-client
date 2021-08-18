// Custom sort for filter + direction
// eslint-disable-next-line
export const sortBid =
  (key: string, sortDir: string) =>
  // eslint-disable-next-line
  (a, b): number => {
    const aValue = a[key];
    const bValue = b[key];
    const isAString = typeof aValue === 'string';
    const isBString = typeof bValue === 'string';

    if (sortDir === 'asc' && isAString) {
      return aValue.localeCompare(bValue);
    }

    if (sortDir === 'asc') {
      if (aValue > bValue) return 1;
      if (bValue > aValue) return -1;
      return 0;
    }

    // Descending logic

    if (isBString) {
      return bValue.localeCompare(aValue);
    }

    if (aValue > bValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  };

export const sortBidMobile =
  () =>
  // eslint-disable-next-line
  (a, b): number => {
    const aValueStart = a.startAt;
    const bValueStart = b.startAt;

    // If Start at is same then check for it's cost min
    if (aValueStart === bValueStart) {
      const aCostMin = Number(a.costMin);
      const bCostMin = Number(b.costMin);
      // eslint-disable-next-line no-nested-ternary
      return aCostMin === bCostMin ? 0 : bCostMin > aCostMin ? 1 : -1;
    }

    return bValueStart > aValueStart ? 1 : -1;
  };

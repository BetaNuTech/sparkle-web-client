import { useState } from 'react';

export const useSortBy = (defaultSort = 'name'): Array<any> => {
  const [sortBy, setSortBy] = useState(defaultSort);
  return [sortBy, setSortBy];
};

export const useSortDir = (defaultDir = 'asc'): Array<any> => {
  const [sortDir, setSortDir] = useState(defaultDir);
  return [sortDir, setSortDir];
};

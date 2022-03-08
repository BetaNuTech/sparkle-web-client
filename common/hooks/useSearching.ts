import React, { ChangeEvent, useEffect, useState } from 'react';
import debounce from '../utils/debounce';
import utilString from '../utils/string';
import utilSearch from '../utils/search';

type Model = Record<string, any>;

interface useSearchResult {
  filteredItems: Model[];
  searchParam: string;
  searchValue: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

// Hooks for filtering list
export default function useSearching(
  items: Model[],
  queryAttrs: string[],
  defaultQuery?: string[]
): useSearchResult {
  let filteredItems = [...items];
  const [memo, setMemo] = useState('[]');
  const [searchParam, setSearchParam] = useState<string[]>(defaultQuery || []);
  const [searchValue, setSearchValue] = useState<string>('');

  const onSearchChange = debounce(
    (value: string) => {
      // Get the keywords from inputs
      const query = utilString.getSearchKeywords(value);
      setSearchParam(query);
    },
    300,
    {}
  );

  // Create search index from list of items
  const searchIndex = utilSearch.createSearchIndex(items, queryAttrs);

  // Filter the ids which are present in the search params
  const filteredIds = utilSearch.querySearchIndex(searchIndex, searchParam);

  // Now we will look for ids which are present in filtered index
  filteredItems = items.filter((itm) => filteredIds.includes(itm.id));

  // If search params are cleared we need to set it to the original list
  if (searchParam.length === 0) {
    filteredItems = [...items];
  }

  const onSearchKeyDown = (ev) => {
    setSearchValue(ev.target.value);
    onSearchChange(ev.target.value);
  };

  const onClearSearch = () => {
    setSearchValue('');
    setSearchParam(defaultQuery || []);
  };

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(filteredItems);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    onSearchKeyDown,
    searchParam: searchParam.join(' '),
    searchValue,
    filteredItems,
    onClearSearch
  };
}

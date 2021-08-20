import { useEffect, useState } from 'react';

const useItemState = (defaultState = ''): Array<any> => {
  const [filterState, setFilterState] = useState(defaultState);
  return [filterState, setFilterState];
};

interface useFilterStateResult {
  stateItems: Array<any>;
  filterState: string;
  changeFilterState(state: string): void;
}

// Hooks for filtering array list on given state
export default function useFilterState(
  items: Array<any>
): useFilterStateResult {
  const [memo, setMemo] = useState('[]');
  const [filterState, setFilterState] = useItemState();

  // Set sort attribute & direction
  const changeFilterState = (state: string) => {
    // Update job filter state
    if (filterState === state) {
      setFilterState('');
    } else {
      setFilterState(state);
    }
  };

  const stateItems =
    filterState.length > 0
      ? items.filter((i) => i.state === filterState)
      : items;

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(stateItems);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    stateItems,
    filterState,
    changeFilterState
  };
}

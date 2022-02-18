import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import useIsFirstMount from '../../../common/hooks/useIsFirstMount';
import useSearching from '../../../common/hooks/useSearching';
import deficientItemModel from '../../../common/models/deficientItem';
import deficienciesSession from '../../../common/services/session/deficiencies';
import utilArray from '../../../common/utils/array';

type userNotifications = (message: string, options?: any) => any;

export interface Params {
  selectedDeficiencies: Record<string, string[]>;
  onGroupSelection(state: string, evt: ChangeEvent<HTMLInputElement>): void;
  onClearGroupSelection(state: string): void;
  onSelectDeficiency(state: string, deficiencyId: string): void;
  deficientItemsByState: Map<string, deficientItemModel[]>;
  searchParam: string;
  onSearchKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch(): void;
}

// Hook to set and get
// selected deficient items
export default function useSelectionsAndSearch(
  sortedDeficientItems: deficientItemModel[],
  propertyId: string,
  sendNotification: userNotifications
): Params {
  const isFirstRender = useIsFirstMount();

  const [selectedDeficiencies, setSelectedDeficiencies] = useState(
    deficienciesSession.getSelectedDeficiencies(propertyId)
  );

  // using useSearching hook
  // to filter deficient items
  // on search
  const { onSearchKeyDown, filteredItems, searchParam, onClearSearch } =
    useSearching(sortedDeficientItems, [
      'itemTitle',
      'sectionTitle',
      'sectionSubTitle'
    ]);

  const filteredDeficientItems = filteredItems.map(
    (item) => item as deficientItemModel
  );

  // Grouping of deficient items by state
  const deficientItemsByState = useMemo(
    () =>
      utilArray.groupBy<string, deficientItemModel>(
        filteredDeficientItems,
        (item) => item.state
      ),
    [filteredDeficientItems]
  );

  // on click on group checkbox
  // if its getting checked it will add top 10 item in selected deficiencies
  // if its getting unchecked it will remove all the selected deficiencies for perticular group
  const onGroupSelection = (
    state: string,
    evt: ChangeEvent<HTMLInputElement>
  ) => {
    const groupDeficienciesIds = (deficientItemsByState.get(state) || []).map(
      (item) => item.id
    );
    if (evt.target.checked) {
      setSelectedDeficiencies({
        ...selectedDeficiencies,
        [state]: groupDeficienciesIds.slice(0, 10)
      });
    } else {
      setSelectedDeficiencies({ ...selectedDeficiencies, [state]: [] });
    }
  };

  const onClearGroupSelection = (state: string) => {
    setSelectedDeficiencies({ ...selectedDeficiencies, [state]: [] });
  };

  const onSelectDeficiency = (state: string, deficiencyId: string) => {
    let selectedIds = selectedDeficiencies[state] || [];

    const isRemoving = selectedIds.includes(deficiencyId);

    // error notification  when user is trying
    // to select more than 10 deficient item
    if (!isRemoving && selectedIds.length >= 10) {
      sendNotification(
        'You may not update more than 10 Deficient Items at a time.',
        { type: 'error' }
      );
      return;
    }

    if (isRemoving) {
      selectedIds = selectedIds.filter((id) => id !== deficiencyId);
    } else {
      selectedIds = [...selectedIds, deficiencyId];
    }
    setSelectedDeficiencies({ ...selectedDeficiencies, [state]: selectedIds });
  };

  // Save selected deficiencies
  // into session storage using
  // session storage service
  useEffect(() => {
    deficienciesSession.setSelectedDeficiencies(
      propertyId,
      selectedDeficiencies
    );
  }, [selectedDeficiencies]); // eslint-disable-line

  // clear selection on search
  // and laso prevent it to clear selection
  // on initial render
  useEffect(() => {
    if (!isFirstRender) {
      setSelectedDeficiencies({});
    }
  }, [searchParam]); // eslint-disable-line

  return {
    selectedDeficiencies,
    onGroupSelection,
    onClearGroupSelection,
    onSelectDeficiency,
    onSearchKeyDown,
    deficientItemsByState,
    searchParam,
    onClearSearch
  };
}

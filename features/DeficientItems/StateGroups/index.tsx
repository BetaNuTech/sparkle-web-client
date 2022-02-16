import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import { deficientItemStateOrder } from '../../../config/deficientItems';
import Header from './Header';
import List from './List';
import SearchBar from './SearchBar';
import styles from './styles.module.scss';

interface Props {
  deficientItemsByState: Map<string, deficientItemModel[]>;
  forceVisible?: boolean;
  searchQuery: string;
  setSearchQuery(query: string): void;
  onSearchKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
  onClearSearch(): void;
  isMobile: boolean;
  onGroupSelection(state: string, evt: ChangeEvent<HTMLInputElement>): void;
  onSelectDeficiency(state: string, deficiencyId: string): void;
  selectedDeficiencies: Record<string, string[]>;
}

const DeficientItemsStateGroups: FunctionComponent<Props> = ({
  deficientItemsByState,
  searchQuery,
  setSearchQuery,
  onSearchKeyDown,
  onClearSearch,
  forceVisible,
  isMobile,
  onGroupSelection,
  onSelectDeficiency,
  selectedDeficiencies
}) => (
  <div className={styles.container}>
    {!isMobile && (
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
    )}
    {deficientItemStateOrder.map((deficientItemState) => {
      const deficientItems =
        deficientItemsByState.get(deficientItemState) || [];

      if (deficientItems.length === 0) {
        return <Fragment key={deficientItemState}></Fragment>;
      }
      const groupSelections = selectedDeficiencies[deficientItemState] || [];
      const firstTenDIs = deficientItems.slice(0, 10);
      const isChecked = firstTenDIs.every((item) =>
        groupSelections.includes(item.id)
      );

      return (
        <div key={deficientItemState} className={styles.main}>
          <Header
            state={deficientItemState}
            itemCount={deficientItems.length}
            onGroupSelection={onGroupSelection}
            checked={isChecked}
            isMobile={isMobile}
            selectedCount={groupSelections.length}
          />
          <List
            deficientItems={deficientItems}
            forceVisible={forceVisible}
            isMobile={isMobile}
            onSelectDeficiency={onSelectDeficiency}
            selectedDeficiencies={groupSelections}
          />
        </div>
      );
    })}

    {deficientItemsByState.size === 0 && (
      <h3 className="-c-gray-light -pt-sm -pl-sm -pb-sm -ta-center">
        None found
      </h3>
    )}

    {searchQuery && (
      <div className={styles.action}>
        <button className={styles.action__clear} onClick={onClearSearch}>
          Clear Search
        </button>
      </div>
    )}
  </div>
);

export default DeficientItemsStateGroups;

import React, {
  FunctionComponent,
  Fragment,
  ChangeEvent,
  RefObject
} from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import { deficientItemStateOrder } from '../../../config/deficientItems';
import Header from './Header';
import List from './List';
import styles from './styles.module.scss';

interface Props {
  deficientItemsByState: Map<string, deficientItemModel[]>;
  forceVisible?: boolean;
  searchQuery: string;
  onSearchKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
  onClearSearch(): void;
  isMobile: boolean;
  onGroupSelection(state: string, evt: ChangeEvent<HTMLInputElement>): void;
  onSelectDeficiency(state: string, deficiencyId: string): void;
  selectedDeficiencies: Record<string, string[]>;
  onMoveToState(currentState: string, nextState: string): void;
  canGoBack: boolean;
  canClose: boolean;
  canDefer: boolean;
  containerRef: RefObject<HTMLDivElement>;
}

const DeficientItemsStateGroups: FunctionComponent<Props> = ({
  deficientItemsByState,
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  forceVisible,
  isMobile,
  onGroupSelection,
  onSelectDeficiency,
  selectedDeficiencies,
  onMoveToState,
  canGoBack,
  canClose,
  canDefer,
  containerRef
}) => (
  <div className={styles.container} ref={containerRef}>
    {!isMobile && (
      <SearchBar
        searchQuery={searchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
    )}
    {deficientItemStateOrder.map((deficientItemState, index) => {
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
        <div
          key={deficientItemState}
          className={styles.main}
          style={{ zIndex: deficientItemStateOrder.length - index }}
        >
          <Header
            state={deficientItemState}
            itemCount={deficientItems.length}
            onGroupSelection={onGroupSelection}
            checked={isChecked}
            isMobile={isMobile}
            selectedCount={groupSelections.length}
            onMoveToState={onMoveToState}
            canGoBack={canGoBack}
            canClose={canClose}
            canDefer={canDefer}
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
    <ClearSearchAction
      searchQuery={searchQuery}
      onClearSearch={onClearSearch}
    />
  </div>
);

export default DeficientItemsStateGroups;

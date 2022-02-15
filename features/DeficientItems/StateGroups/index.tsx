import React, { FunctionComponent, Fragment } from 'react';
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
}

const DeficientItemsStateGroups: FunctionComponent<Props> = ({
  deficientItemsByState,
  searchQuery,
  setSearchQuery,
  onSearchKeyDown,
  onClearSearch,
  forceVisible,
  isMobile
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

      return (
        <Fragment key={deficientItemState}>
          <Header
            state={deficientItemState}
            itemCount={deficientItems.length}
          />
          <List
            deficientItems={deficientItems}
            forceVisible={forceVisible}
            isMobile={isMobile}
          />
        </Fragment>
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

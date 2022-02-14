import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  searchQuery: string;
  onSearchKeyDown: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch(): void;
  setSearchQuery(query: string): void;
}

const SearchBar: FunctionComponent<Props> = ({
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  setSearchQuery
}) => {
  const showClearSearch = Boolean(searchQuery);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__search}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onKeyDown={onSearchKeyDown}
            onChange={(evt) => setSearchQuery(evt.target.value)}
            data-testid="search-bar-input"
          />
        </div>

        {showClearSearch && (
          <div className="-pr">
            <button
              className={styles.clearButton}
              onClick={onClearSearch}
              data-testid="search-bar-clear"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

SearchBar.defaultProps = {};

export default SearchBar;

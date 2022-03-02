import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

const SearchBar: FunctionComponent<Props> = ({
  searchQuery,
  onSearchKeyDown,
  onClearSearch
}) => {
  const showClearSearch = Boolean(searchQuery);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.main__search}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={onSearchKeyDown}
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

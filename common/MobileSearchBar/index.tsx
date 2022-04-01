import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  searchQuery: string;
  onChange(evt: ChangeEvent<HTMLInputElement>): void;
  onClearSearch(): void;
  placeholder?: string;
}

const MobileSearchBar: FunctionComponent<Props> = ({
  searchQuery,
  onChange,
  onClearSearch,
  ...props
}) => {
  const showClearSearch = Boolean(searchQuery);

  return (
    <div className={styles.search}>
      <input
        className={styles.search__input}
        type="search"
        value={searchQuery}
        onChange={onChange}
        {...props}
      />

      {showClearSearch && (
        <button
          className={styles.search__clear}
          onClick={onClearSearch}
          data-testid="mobile-search-bar-clear"
        />
      )}
    </div>
  );
};

MobileSearchBar.defaultProps = {
  placeholder: ''
};

export default MobileSearchBar;

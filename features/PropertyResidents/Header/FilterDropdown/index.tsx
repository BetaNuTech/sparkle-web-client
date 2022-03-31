import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  activeFilter?: string;
  onFilterByStatus(evt: ChangeEvent<HTMLSelectElement>): void;
}

const FilterDropdown: FunctionComponent<Props> = ({
  activeFilter,
  onFilterByStatus
}) => (
  <div className={styles.filter}>
    <div className={styles.filter__item}>
      <label className={styles.filter__label}>Filter by:</label>

      <select
        value={activeFilter}
        onChange={onFilterByStatus}
        className={styles.filter__menu}
      >
        <option value="all">All</option>
        <option value="current">Current</option>
        <option value="future">Future</option>
        <option value="eviction">Eviction</option>
        <option value="notice">Notice</option>
        <option value="vacant">Vacant</option>
      </select>
    </div>
  </div>
);

FilterDropdown.defaultProps = {
  activeFilter: 'all'
};

export default FilterDropdown;

import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  label?: string;
  value: string;
  onChange(evt: ChangeEvent<HTMLSelectElement>): void;
  options: Record<string, string>[];
}

const FilterDropdown: FunctionComponent<Props> = ({
  label = 'Filter:',
  value,
  onChange,
  options
}) => (
  <div className={styles.filterBy}>
    <div className={styles.filterBy__item}>
      <label className={styles.filterBy__label}>{label}</label>

      <select
        value={value}
        onChange={onChange}
        className={styles.filterBy__menu}
        data-testid="users-filter-dropdown"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FilterDropdown;

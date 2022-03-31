import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  sortBy: string;
  sortDir: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
  options: Record<string, string>[];
}

const SortDropdown: FunctionComponent<Props> = ({
  options,
  sortDir,
  sortBy,
  onSortChange,
  onSortDirChange
}) => (
  <div className={styles.sortBy}>
    <div className={styles.sortBy__item}>
      <label className={styles.sortBy__label}>Sort by:</label>

      <select
        value={sortBy}
        onChange={onSortChange}
        className={styles.sortBy__menu}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    <div className={styles.sortBy__item}>
      <button
        onClick={onSortDirChange}
        className={clsx(styles.sortBy__sortDirButton, styles[`-${sortDir}`])}
      />
    </div>
  </div>
);

export default SortDropdown;

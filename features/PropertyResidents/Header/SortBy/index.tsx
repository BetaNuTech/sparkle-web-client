import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  sortBy?: string;
  sortDir?: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
}

const SortBy: FunctionComponent<Props> = ({
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
        <option value="leaseUnit">Unit</option>
        <option value="id">Resident ID</option>
        <option value="firstName">Resident First Name</option>
        <option value="lastName">Resident Last Name</option>
        <option value="yardiStatus">Current Status</option>
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

SortBy.defaultProps = {
  sortBy: 'unit',
  sortDir: 'asc'
};

export default SortBy;

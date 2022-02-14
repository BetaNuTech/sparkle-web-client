import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  sortBy: string;
  sortDir: string;
  onSortChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onSortDirChange(): void;
}

const SortBy: FunctionComponent<Props> = ({
  sortBy,
  sortDir,
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
        <option value="updatedAt">Last Update</option>
        <option value="currentResponsibilityGroup">Responsibility Group</option>
        <option value="finalDueDate">Due/Deferred Date</option>
        <option value="grade">Grade</option>
        <option value="createdAt">Deficient Date</option>
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
  sortBy: 'updatedAt',
  sortDir: 'asc'
};

export default SortBy;

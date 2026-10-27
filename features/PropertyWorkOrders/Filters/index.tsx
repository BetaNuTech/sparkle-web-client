import { ChangeEvent, FunctionComponent } from 'react';
import clsx from 'clsx';
import { WorkOrderState } from '../hooks/useWorkOrderFilters';
import styles from './styles.module.scss';

interface Props {
  state: WorkOrderState;
  unit: string;
  from: string;
  to: string;
  hasFilters: boolean;
  isMobile?: boolean;
  onStateChange(evt: ChangeEvent<HTMLSelectElement>): void;
  onUnitChange(evt: ChangeEvent<HTMLInputElement>): void;
  onFromChange(evt: ChangeEvent<HTMLInputElement>): void;
  onToChange(evt: ChangeEvent<HTMLInputElement>): void;
  onClearFilters(): void;
}

// Work order list filters: open/closed,
// unit, and last-modified date range
const Filters: FunctionComponent<Props> = ({
  state,
  unit,
  from,
  to,
  hasFilters,
  isMobile,
  onStateChange,
  onUnitChange,
  onFromChange,
  onToChange,
  onClearFilters
}) => (
  <div
    className={clsx(styles.filters, isMobile && styles['filters--mobile'])}
    data-testid="work-order-filters"
  >
    <div className={styles.filters__item}>
      <label className={styles.filters__label} htmlFor="work-order-state">
        Show:
      </label>
      <select
        id="work-order-state"
        value={state}
        onChange={onStateChange}
        className={styles.filters__menu}
        data-testid="work-order-state-filter"
      >
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
    </div>

    <div className={styles.filters__item}>
      <label className={styles.filters__label} htmlFor="work-order-unit">
        Unit:
      </label>
      <input
        id="work-order-unit"
        type="text"
        value={unit}
        maxLength={8}
        placeholder="Any"
        onChange={onUnitChange}
        className={clsx(styles.filters__input, styles['filters__input--unit'])}
        data-testid="work-order-unit-filter"
      />
    </div>

    <div className={styles.filters__item}>
      <label className={styles.filters__label} htmlFor="work-order-from">
        Updated:
      </label>
      <input
        id="work-order-from"
        type="date"
        value={from}
        max={to || undefined}
        onChange={onFromChange}
        className={styles.filters__input}
        data-testid="work-order-from-filter"
      />
      <span className={styles.filters__separator}>to</span>
      <input
        id="work-order-to"
        type="date"
        value={to}
        min={from || undefined}
        onChange={onToChange}
        className={styles.filters__input}
        aria-label="Updated to"
        data-testid="work-order-to-filter"
      />
    </div>

    {hasFilters && (
      <button
        type="button"
        onClick={onClearFilters}
        className={styles.filters__clear}
        data-testid="work-order-clear-filters"
      >
        Clear
      </button>
    )}

    {state === 'closed' && !from && (
      <span
        className={styles.filters__hint}
        data-testid="work-order-closed-hint"
      >
        Closed work orders from the last 90 days
      </span>
    )}
  </div>
);

Filters.defaultProps = {
  isMobile: false
};

export default Filters;

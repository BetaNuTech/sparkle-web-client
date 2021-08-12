import { FunctionComponent } from 'react';
import clsx from 'clsx';
import parentStyles from '../styles.module.scss';

interface Props {
  onSortChange?(sortKey: string): void;
  sortBy?: string;
  sortDir?: string;
}

const GridHeader: FunctionComponent<Props> = ({
  onSortChange,
  sortBy,
  sortDir
}) => (
  <>
    <header
      className={clsx(parentStyles.propertyJobBids__gridHeader)}
      data-testid="grid-header"
    >
      <button
        className={clsx(
          parentStyles.propertyJobBids__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'vendor'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobBids__gridHeader__column--ascending']
              : parentStyles['propertyJobBids__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-bid-vendor"
        onClick={() => onSortChange('vendor')}
      >
        Vendor
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobBids__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'startAt'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobBids__gridHeader__column--ascending']
              : parentStyles['propertyJobBids__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-bid-started"
        onClick={() => onSortChange('startAt')}
      >
        Started
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobBids__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'completeAt'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobBids__gridHeader__column--ascending']
              : parentStyles['propertyJobBids__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-bid-completed"
        onClick={() => onSortChange('completeAt')}
      >
        Completed
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobBids__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'costMin'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobBids__gridHeader__column--ascending']
              : parentStyles['propertyJobBids__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-cost-max"
        onClick={() => onSortChange('costMin')}
      >
        Cost Max
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
    </header>
  </>
);

export default GridHeader;

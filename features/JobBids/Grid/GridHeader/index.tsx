import { FunctionComponent } from 'react';
import clsx from 'clsx';
import parentStyles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const GridHeader: FunctionComponent<Props> = () => (
  <>
    <header
      className={clsx(parentStyles.propertyJobBids__gridHeader)}
      data-testid="grid-header"
    >
      <button
        className={clsx(parentStyles.propertyJobBids__gridHeader__column)}
        data-testid="grid-head-bid-vendor"
      >
        Vendor
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(parentStyles.propertyJobBids__gridHeader__column)}
        data-testid="grid-head-bid-started"
      >
        Started
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(parentStyles.propertyJobBids__gridHeader__column)}
        data-testid="grid-head-bid-completed"
      >
        Completed
        <span
          className={parentStyles.propertyJobBids__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(parentStyles.propertyJobBids__gridHeader__column)}
        data-testid="grid-head-cost-max"
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

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import parentStyles from '../styles.module.scss';

const GridHeader: FunctionComponent = () => (
  <>
    <label className={styles.propertyJobs__search}>
      <input
        placeholder="Search Jobs"
        className={styles.propertyJobs__search__input}
        type="search"
      />
    </label>
    <header
      className={clsx(parentStyles.propertyJobs__gridHeader)}
      data-testid="grid-header"
    >
      <button
        className={clsx(parentStyles.propertyJobs__gridHeader__column)}
        data-testid="grid-head-inspector-name"
      >
        Title
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button className={clsx(parentStyles.propertyJobs__gridHeader__column)}>
        Created
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button className={clsx(parentStyles.propertyJobs__gridHeader__column)}>
        Updated
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button className={clsx(parentStyles.propertyJobs__gridHeader__column)}>
        Job Type
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
    </header>
  </>
);

export default GridHeader;

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import SearchBar from '../../../../common/SearchBar';

import parentStyles from '../styles.module.scss';

interface Props {
  onSortChange?(sortKey: string): void;
  onSearchKeyDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
  onClearSearch(): void;
  sortBy?: string;
  sortDir?: string;
  searchQuery?: string;
}

const GridHeader: FunctionComponent<Props> = ({
  onSortChange,
  onSearchKeyDown,
  onClearSearch,
  sortBy,
  sortDir,
  searchQuery
}) => (
  <>
    <SearchBar
      onSearchKeyDown={onSearchKeyDown}
      searchQuery={searchQuery}
      onClearSearch={onClearSearch}
      sideBorders={true} // eslint-disable-line react/jsx-boolean-value
    />
    <header
      className={clsx(parentStyles.propertyJobs__gridHeader)}
      data-testid="grid-header"
    >
      <button
        className={clsx(
          parentStyles.propertyJobs__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'title'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobs__gridHeader__column--ascending']
              : parentStyles['propertyJobs__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-job-title"
        onClick={() => onSortChange('title')}
      >
        Title
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobs__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'createdAt'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobs__gridHeader__column--ascending']
              : parentStyles['propertyJobs__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-job-created"
        onClick={() => onSortChange('createdAt')}
      >
        Created
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobs__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'updatedAt'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobs__gridHeader__column--ascending']
              : parentStyles['propertyJobs__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-job-updated"
        onClick={() => onSortChange('updatedAt')}
      >
        Updated
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <button
        className={clsx(
          parentStyles.propertyJobs__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'type'
            ? sortDir === 'asc'
              ? parentStyles['propertyJobs__gridHeader__column--ascending']
              : parentStyles['propertyJobs__gridHeader__column--descending']
            : ''
        )}
        data-testid="grid-head-job-type"
        onClick={() => onSortChange('type')}
      >
        Job Type
        <span
          className={parentStyles.propertyJobs__gridHeader__direction}
        ></span>
      </button>
      <h6 className={parentStyles.propertyJobs__gridHeader__column}>&nbsp;</h6>
    </header>
  </>
);

export default GridHeader;

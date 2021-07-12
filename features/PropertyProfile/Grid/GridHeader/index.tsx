import { FunctionComponent } from 'react';
import clsx from 'clsx';
import userModel from '../../../../common/models/user';
import hasInspectionUpdateActions from '../../utils/hasInspectionUpdateActions';
import styles from '../styles.module.scss';

interface Props {
  user: userModel;
  onSortChange?(sortKey: string): void;
  sortBy?: string;
  sortDir?: string;
}

const GridHeader: FunctionComponent<Props> = ({
  user,
  onSortChange,
  sortBy,
  sortDir
}) => {
  const hasActionColumn = hasInspectionUpdateActions(user);
  return (
    <header
      className={clsx(
        styles.propertyProfile__gridHeader,
        hasActionColumn ? '' : '-six-columns'
      )}
      data-testid="grid-header"
    >
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'inspectorName'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('inspectorName')}
        data-testid="grid-head-inspector-name"
      >
        Creator
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'creationDate'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('creationDate')}
      >
        Created
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'updatedAt'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('updatedAt')}
      >
        Updated
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'templateName'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('templateName')}
      >
        Template
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'templateCategory'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('templateCategory')}
      >
        Category
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      <button
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          // eslint-disable-next-line no-nested-ternary
          sortBy === 'score'
            ? sortDir === 'asc'
              ? styles['propertyProfile__gridHeader__column--ascending']
              : styles['propertyProfile__gridHeader__column--descending']
            : ''
        )}
        onClick={() => onSortChange('score')}
      >
        Score
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </button>
      {hasActionColumn ? (
        <h6 className={styles.propertyProfile__gridHeader__column}>&nbsp;</h6>
      ) : null}
    </header>
  );
};

export default GridHeader;

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import userModel from '../../../../common/models/user';
import hasInspectionUpdateActions from '../../utils/hasInspectionUpdateActions';
import styles from '../styles.module.scss';

interface Props {
  user: userModel;
}

const GridHeader: FunctionComponent<Props> = ({ user }) => {
  const hasActionColumn = hasInspectionUpdateActions(user);
  return (
    <header
      className={clsx(
        styles.propertyProfile__gridHeader,
        hasActionColumn ? '' : '-six-columns'
      )}
      data-testid="grid-header"
    >
      <h6 className={styles.propertyProfile__gridHeader__column}>
        Creator
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      <h6
        className={clsx(
          styles.propertyProfile__gridHeader__column,
          '-descending'
        )}
      >
        Created
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      <h6 className={styles.propertyProfile__gridHeader__column}>
        Updated
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      <h6 className={styles.propertyProfile__gridHeader__column}>
        Template
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      <h6 className={styles.propertyProfile__gridHeader__column}>
        Category
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      <h6 className={styles.propertyProfile__gridHeader__column}>
        Score
        <span className={styles.propertyProfile__gridHeader__direction}></span>
      </h6>
      {hasActionColumn ? (
        <h6 className={styles.propertyProfile__gridHeader__column}>&nbsp;</h6>
      ) : null}
    </header>
  );
};

export default GridHeader;

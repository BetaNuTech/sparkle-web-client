import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import arrayUtils from '../utils/array';

interface Props {
  className?: string;
  rows?: number;
}

const SkeletonLoader: FunctionComponent<Props> = ({ className, rows }) => (
  <div className={clsx(styles.container, className)}>
    {arrayUtils.range(0, rows - 1).map((id) => (
      <div key={id} className={styles.loader} />
    ))}
  </div>
);

SkeletonLoader.defaultProps = {
  className: '',
  rows: 10
};

export default SkeletonLoader;

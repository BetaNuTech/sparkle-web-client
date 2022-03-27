import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';

interface Props {
  label: string;
  value: string | number;
}

const Info: FunctionComponent<Props> = ({ label, value, ...props }) => (
  <div className={styles.info}>
    <p className={styles.info__label}>{label}:</p>
    <span className={styles.info__value} {...props}>
      {value}
    </span>
  </div>
);

export default Info;

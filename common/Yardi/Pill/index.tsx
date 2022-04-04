import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

const Pill: FunctionComponent = ({ children }) => (
  <div className={styles.pill}>{children}</div>
);

export default Pill;

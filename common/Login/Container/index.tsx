import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

const LoginContainer: FunctionComponent<Props> = ({ children }) => (
  <div className={styles.container}>
    <section className={styles.main}>{children}</section>
  </div>
);

export default LoginContainer;

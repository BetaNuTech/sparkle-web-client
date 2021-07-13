import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  title?: string;
}

const LoadingHud: FunctionComponent<Props> = ({ title }) => (
  <div className={styles.overlay}>
    <div className={styles.loader}>
      <div className={styles.loader__centered}>
        <img src="/img/sparkle-loader.gif" alt="loader" />
        <h3 className={styles.loader__blink} data-testid="api-loader-text">
          {title}
        </h3>
      </div>
    </div>
  </div>
);

LoadingHud.defaultProps = {
  title: 'Loading'
};

export default LoadingHud;

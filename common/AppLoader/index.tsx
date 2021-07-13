import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  title?: string;
}

const AppLoader: FunctionComponent<Props> = ({ title }) => (
  <div className={styles.loader}>
    <div className={styles.loader__centered}>
      <img src="/img/sparkle-loader.gif" alt="application loader" />
      <h3 className={styles.loader__blink} data-testid="app-loader-text">
        {title}
      </h3>
    </div>
  </div>
);

AppLoader.defaultProps = {
  title: 'Loading'
};

export default AppLoader;

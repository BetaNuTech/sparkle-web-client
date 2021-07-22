import { FunctionComponent } from 'react';
import getConfig from 'next/config';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  title?: string;
}

const LoadingHud: FunctionComponent<Props> = ({ title }) => (
  <div className={styles.overlay}>
    <div className={styles.loader}>
      <div className={styles.loader__centered}>
        <img src={`${basePath}/img/sparkle-loader.gif`} alt="loader" />
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

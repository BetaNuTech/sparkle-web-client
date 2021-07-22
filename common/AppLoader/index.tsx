import { FunctionComponent } from 'react';
import getConfig from 'next/config';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  title?: string;
}

const AppLoader: FunctionComponent<Props> = ({ title }) => (
  <div className={styles.loader}>
    <div className={styles.loader__centered}>
      <img
        src={`${basePath}/img/sparkle-loader.gif`}
        alt="application loader"
      />
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

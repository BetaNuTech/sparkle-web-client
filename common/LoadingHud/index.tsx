import { FunctionComponent } from 'react';
import getConfig from 'next/config';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  title?: string;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  isOnline?: boolean;
  isNavOpen?: boolean;
  hasProgress?: boolean;
  progressValue?: number;
}

const LoadingHud: FunctionComponent<Props> = ({
  title,
  hasProgress,
  progressValue
}) => (
  <div className={styles.overlay}>
    <div className={styles.loader}>
      <div className={styles.loader__centered}>
        <img src={`${basePath}/img/sparkle-loader.gif`} alt="loader" />
        <h3 className={styles.loader__blink} data-testid="api-loader-text">
          {title}
        </h3>
      </div>
      {hasProgress && (
        <div className={styles.loader__progress}>
          <div
            className={styles.loader__progress__fill}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
      )}
    </div>
  </div>
);

LoadingHud.defaultProps = {
  title: 'Loading',
  hasProgress: false,
  progressValue: 0
};

export default LoadingHud;

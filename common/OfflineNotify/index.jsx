import styles from './OfflineNotify.module.scss';

export const OfflineNotify = () => (
  <div className={styles.OfflineNotify}>
    <div className={styles.OfflineNotify__wrapper}>
      <h1 className={styles.OfflineNotify__title}>OFFLINE</h1>

      <h4 className={styles.OfflineNotify__message}>
        Please check your internet connection
      </h4>

      <a href="." className={styles.OfflineNotify__retryButton}>
        RETRY
      </a>
    </div>
  </div>
);

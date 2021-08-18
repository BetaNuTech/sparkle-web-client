import WarningIcon from '../../public/icons/sparkle/warning.svg';
import styles from './styles.module.scss';

const OfflineDesktop = (): JSX.Element => (
  <div className={styles.offline}>
    <WarningIcon />
    <span className="-pl-sm">
      You&lsquo;re disconnected, further updates may be lost.
    </span>
  </div>
);

export default OfflineDesktop;

import clsx from 'clsx';
import { FunctionComponent } from 'react';
import WarningIcon from '../../../../public/icons/sparkle/warning.svg';
import styles from './styles.module.scss';

interface Props {
  onClick(): void;
}

const AuthError: FunctionComponent<Props> = ({ onClick }) => (
  <div className={styles.container}>
    <WarningIcon className={clsx(styles.container__icon, '-fill-warning')} />
    <span className={styles.container__title}>Authorization Failed</span>
    <button className={styles.container__action} onClick={onClick}>
      Try Again
    </button>
  </div>
);

export default AuthError;

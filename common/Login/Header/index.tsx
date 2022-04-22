import { FunctionComponent } from 'react';

import SparkleLogo from '../../../public/icons/sparkle/logo.svg';

import styles from './styles.module.scss';

interface Props {
  isStaging?: boolean;
}

const LoginHeader: FunctionComponent<Props> = ({ isStaging }) => (
  <header className={styles.header}>
    {isStaging ? (
      <h1 className={styles.header__title}>Staging</h1>
    ) : (
      <SparkleLogo className={styles.header__logo} />
    )}
  </header>
);

export default LoginHeader;

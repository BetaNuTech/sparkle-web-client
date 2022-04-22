import { FunctionComponent } from 'react';

import BlueStoneLogo from '../../../public/icons/sparkle/bluestone-logo.svg';

import styles from './styles.module.scss';

interface Props {
  hideVersion?: boolean;
}
const LoginFooter: FunctionComponent<Props> = ({ hideVersion }) => (
  <footer className={styles.footer}>
    <BlueStoneLogo className={styles.footer__logo} />
    {!hideVersion && <p className={styles.footer__version}>v0.1.0</p>}
  </footer>
);

LoginFooter.defaultProps = {
  hideVersion: false
};

export default LoginFooter;

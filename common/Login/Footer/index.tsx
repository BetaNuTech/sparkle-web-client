import getConfig from 'next/config';
import { FunctionComponent } from 'react';
import BlueStoneLogo from '../../../public/icons/sparkle/bluestone-logo.svg';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const APP_VERSION = publicRuntimeConfig.appVersion || '';

interface Props {
  hideVersion?: boolean;
}
const LoginFooter: FunctionComponent<Props> = ({ hideVersion }) => (
  <footer className={styles.footer}>
    <BlueStoneLogo className={styles.footer__logo} />
    {!hideVersion && <p className={styles.footer__version}>v{APP_VERSION}</p>}
  </footer>
);

LoginFooter.defaultProps = {
  hideVersion: false
};

export default LoginFooter;

import getConfig from 'next/config';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  title: string;
}

const Loader: FunctionComponent<Props> = ({ title }) => (
  <div className={styles.container}>
    <img src={`${basePath}/img/sparkle-loader.gif`} alt="loader" />
    <span className={styles.container__title}>{title}</span>
  </div>
);

export default Loader;

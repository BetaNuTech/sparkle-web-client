import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  text: string;
  type: string;
}

const Badge: FunctionComponent<Props> = ({ text, type, ...props }) => (
  <div className={clsx(styles.badge, styles[`badge--${type}`])}>
    <span {...props}>{text}</span>
  </div>
);

export default Badge;

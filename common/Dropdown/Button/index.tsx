import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';

interface Props {
  children: any;
  className?: string;
  onClick?: (any) => any;
}
export const Button: FunctionComponent<Props> = ({
  children,
  className,
  onClick
}) => (
  <li className={styles.dropdown__item} data-testid="dropdown-button">
    <button className={className} onClick={onClick}>
      {children}
    </button>
  </li>
);
export default Button;

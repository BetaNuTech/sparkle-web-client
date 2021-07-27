import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';

interface Props {
  children: any;
  className?: string;
  onClick?: (any) => any;
  testid?: string;
}
export const DropdownButton: FunctionComponent<Props> = ({
  children,
  className,
  testid,
  onClick
}) => (
  <li className={styles.dropdown__item} data-testid={testid}>
    <button className={className} onClick={onClick}>
      {children}
    </button>
  </li>
);

DropdownButton.defaultProps = {
  testid: 'dropdown-button'
};

export default DropdownButton;

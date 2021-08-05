import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';

interface Props {
  children: any;
  className?: string;
  onClick?: (any) => any;
  testid?: string;
  disabled?: boolean;
  // All other props
  [x: string]: any;
}
export const DropdownButton: FunctionComponent<Props> = ({
  children,
  className,
  testid,
  disabled,
  onClick,
  ...props
}) => (
  <li className={styles.dropdown__item} data-testid={testid}>
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  </li>
);

DropdownButton.defaultProps = {
  testid: 'dropdown-button',
  disabled: false
};

export default DropdownButton;

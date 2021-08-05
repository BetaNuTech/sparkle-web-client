import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import DropdownLink from './Link';
import DropdownButton from './Button'; // eslint-disable-line

interface Props {
  children: React.ReactElement | React.ReactElement[];
  isOnRight?: boolean;
}

const Dropdown: FunctionComponent<Props> = ({ children, isOnRight }) => (
  <ul className={clsx(styles.dropdown, isOnRight && styles['dropdown--right'])}>
    {children}
  </ul>
);

Dropdown.defaultProps = {
  isOnRight: false
};

export { DropdownLink, DropdownButton };
export default Dropdown;

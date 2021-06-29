import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import DropdownLink from './Link';
import DropdownButton from './Button';

interface Props {
  children: React.ReactElement | React.ReactElement[];
}

const Dropdown: FunctionComponent<Props> = ({ children }) => (
  <ul className={styles.dropdown}>{children}</ul>
);

export { DropdownLink, DropdownButton };
export default Dropdown;

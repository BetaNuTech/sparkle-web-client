import { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from '../styles.module.scss';

interface Props {
  children: string;
  href: string;
}
const DropdownLink: FunctionComponent<Props> = ({ children, href }) => (
  <li className={styles.dropdown__item} data-testid="dropdown-link">
    <Link href={href}>
      <a>{children}</a>
    </Link>
  </li>
);

export default DropdownLink;

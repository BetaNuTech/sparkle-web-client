import { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from '../styles.module.scss';

interface Props {
  children: string;
  href: string;
  testid?: string;
}
const DropdownLink: FunctionComponent<Props> = ({ children, href, testid }) => (
  <li className={styles.dropdown__item} data-testid={testid}>
    <Link href={href}>
      <a>{children}</a>
    </Link>
  </li>
);

DropdownLink.defaultProps = {
  testid: 'dropdown-link'
};

export default DropdownLink;

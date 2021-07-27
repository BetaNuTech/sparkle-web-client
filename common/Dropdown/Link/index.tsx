import { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from '../styles.module.scss';

interface Props {
  children: string;
  href: string;
  testid?: string;
  className?: any;
}
const DropdownLink: FunctionComponent<Props> = ({
  children,
  href,
  testid,
  className
}) => (
  <li className={styles.dropdown__item} data-testid={testid}>
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  </li>
);

DropdownLink.defaultProps = {
  testid: 'dropdown-link'
};

export default DropdownLink;

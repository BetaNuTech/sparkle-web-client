import Link from 'next/link';
import styles from './Dropdown.module.scss';

export const Dropdown = () => (
  <ul className={styles.dropdown}>
    <li className={styles.dropdown__item}>
      <Link href="/teams/create">
        <a> Add Team</a>
      </Link>
    </li>
    <li className={styles.dropdown__item}>
      <Link href="properties/update">
        <a>Add Property</a>
      </Link>
    </li>
  </ul>
);

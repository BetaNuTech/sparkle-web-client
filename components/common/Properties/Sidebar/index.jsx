import styles from './Sidebar.module.scss';
import { Item } from './Item';

export const Sidebar = () => (
  <nav className={styles.sidebar}>
    <h4 className={styles.sidebar__heading}>Teams</h4>

    <ul className={styles.sidebar__list}>
      <Item name="Team one" />
      <Item name="Team one" />
      <Item name="Team one" />
    </ul>
  </nav>
);

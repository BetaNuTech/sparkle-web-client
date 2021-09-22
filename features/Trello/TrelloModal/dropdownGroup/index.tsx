import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';

interface Props {
  title: string;
  board: string;
  list: string;
}

const DropdownGroup: FunctionComponent<Props> = ({ title, board, list }) => (
  <div className={styles.trelloModal__dropdownGroup}>
    <h3 className={styles.trelloModal__dropdownGroup__title}>{title}</h3>
    <div className={styles.trelloModal__dropdownGroup__dropdown}>
      <h4 className={styles.trelloModal__dropdownGroup__dropdown__label}>
        Board
      </h4>
      {board}
    </div>
    <div className={styles.trelloModal__dropdownGroup__dropdown}>
      <h4 className={styles.trelloModal__dropdownGroup__dropdown__label}>
        List
      </h4>
      {list}
    </div>
  </div>
);

export default DropdownGroup;

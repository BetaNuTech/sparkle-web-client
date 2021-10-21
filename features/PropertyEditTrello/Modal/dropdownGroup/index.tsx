import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';
import {
  trelloBoard,
  trelloList
} from '../../../../common/services/api/trello';

interface Props {
  title: string;
  board: trelloBoard;
  list: trelloList;
  status: string;
  openSelectionModal: (string) => void;
  isLoadingLists: boolean;
}

const DropdownGroup: FunctionComponent<Props> = ({
  title,
  board,
  list,
  status,
  isLoadingLists,
  openSelectionModal
}) => {
  const boardName = (board && board.name) || 'Not Set';
  const listName = (list && list.name) || 'Not Set';

  return (
    <div className={styles.trelloModal__dropdownGroup}>
      <h3 className={styles.trelloModal__dropdownGroup__title}>{title}</h3>
      <div
        className={styles.trelloModal__dropdownGroup__dropdown}
        onClick={() => openSelectionModal(`${status}Boards`)}
        data-testid={`${status}-boards-pill`}
      >
        <h4 className={styles.trelloModal__dropdownGroup__dropdown__label}>
          Board
        </h4>
        {boardName}
      </div>
      <div
        className={clsx(
          styles.trelloModal__dropdownGroup__dropdown,
          !boardName && styles['trelloModal__dropdownGroup__dropdown--disabled']
        )}
        onClick={() => openSelectionModal(`${status}Lists`)}
        data-testid={`${status}-lists-pill`}
      >
        <h4 className={styles.trelloModal__dropdownGroup__dropdown__label}>
          List
        </h4>
        {isLoadingLists ? 'Loading...' : listName}
      </div>
    </div>
  );
};

export default DropdownGroup;

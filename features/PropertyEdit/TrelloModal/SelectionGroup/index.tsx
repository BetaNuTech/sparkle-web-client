import { FunctionComponent } from 'react';
import clsx from 'clsx';
import {
  trelloBoard,
  trelloList
} from '../../../../common/services/api/trello';
import styles from './styles.module.scss';

interface Props {
  title: string;
  board: trelloBoard;
  list: trelloList;
  status: string;
}

const SelectionGroup: FunctionComponent<Props> = ({
  title,
  board,
  list,
  status
}) => {
  const boardName = (board && board.name) || 'Not Set';
  const listName = (list && list.name) || 'Not Set';
  const isListDisabled = Boolean(!board || !board.name);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.dropdown} data-testid={`${status}-boards-pill`}>
        <h4 className={styles.label}>Board</h4>
        {boardName}
      </div>
      <div
        className={clsx(
          styles.dropdown,
          isListDisabled && styles['dropdown--disabled']
        )}
        data-testid={`${status}-lists-pill`}
      >
        <h4 className={styles.label}>List</h4>
        {listName}
      </div>
    </div>
  );
};

export default SelectionGroup;

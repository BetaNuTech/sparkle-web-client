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
  openSelectionModal: (option: string) => void;
  isLoadingLists: boolean;
  isSaving: boolean;
}

const SelectionGroup: FunctionComponent<Props> = ({
  title,
  board,
  list,
  status,
  openSelectionModal,
  isLoadingLists,
  isSaving
}) => {
  const boardName = (board && board.name) || 'Not Set';
  const listName = (list && list.name) || 'Not Set';
  const isListDisabled = Boolean(!board || !board.name) || isSaving;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div
        className={clsx(
          styles.dropdown,
          isSaving && styles['dropdown--disabled']
        )}
        data-testid={`${status}-boards-pill`}
        onClick={() => openSelectionModal(`${status}Boards`)}
      >
        <h4 className={styles.label}>Board</h4>
        {boardName}
      </div>
      <div
        className={clsx(
          styles.dropdown,
          (isListDisabled || isLoadingLists) && styles['dropdown--disabled']
        )}
        data-testid={`${status}-lists-pill`}
        onClick={() => openSelectionModal(`${status}Lists`)}
      >
        <h4 className={styles.label}>List</h4>
        {isLoadingLists ? 'Loading...' : listName}
      </div>
    </div>
  );
};

export default SelectionGroup;

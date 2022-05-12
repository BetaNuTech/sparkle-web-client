import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../../common/Modal/styles.module.scss';

import ChevronIcon from '../../../../public/icons/ios/chevron-left.svg';
import useSearching from '../../../../common/hooks/useSearching';
import SearchBar from '../../../../common/SearchBar';
import Item from './Item';
import { Selected } from '../../../PropertyEditTrello/hooks/usePropertyTrelloSelection';
import {
  trelloBoard,
  trelloList
} from '../../../../common/services/api/trello';

export interface Options {
  openBoards: trelloBoard[];
  openLists: trelloList[];
  closeBoards: trelloBoard[];
  closeLists: trelloList[];
}

interface Props extends ModalProps {
  onClose: () => void;
  selectedOptions: Selected;
  options: Options;
  onSelect: (item: trelloList | trelloBoard) => void;
  activeSelection: string;
}

const SelectionModal: FunctionComponent<Props> = ({
  onClose,
  selectedOptions,
  options,
  onSelect,
  activeSelection
}) => {
  const title = getTitle(activeSelection);

  // Checks for single selected option
  const singularizedActiveSelection = activeSelection.replace(/s$/, '');
  const selectedOption = selectedOptions[singularizedActiveSelection];

  // Checks for options list to show
  const optionsToSelect = options[activeSelection];
  // Options search setup
  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(optionsToSelect, ['name']);

  return (
    <>
      <header
        className={clsx(
          modalStyles.modal__header,
          modalStyles['modal__header--blue'],
          styles.header
        )}
      >
        <button
          onClick={onClose}
          className={clsx(
            modalStyles.modal__closeButton,
            modalStyles['-topLeft']
          )}
          data-testid="close-selection"
        >
          <span className={styles.trelloSelectionModal__backIcon}>
            <ChevronIcon />
          </span>
        </button>
        <h4>{title}</h4>
      </header>
      <SearchBar
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />

      <ul>
        {filteredItems.length ? (
          filteredItems.map((item: trelloList) => (
            <Item
              key={item.id}
              selectedOption={selectedOption}
              item={item}
              onSelect={onSelect}
            />
          ))
        ) : (
          <h5
            data-testid="no-templates"
            className={styles.trelloSelectionModal__emptyHeading}
          >
            {searchValue
              ? 'No search results'
              : 'Trello board has no available lists'}
          </h5>
        )}
      </ul>
    </>
  );
};

export default Modal(SelectionModal, false, styles.trelloSelectionModal);

const getTitle = (activeSelection: string) => {
  let modalTitle = '';

  switch (activeSelection) {
    case 'openBoards':
      modalTitle = 'Select Open Trello Board';
      break;
    case 'openLists':
      modalTitle = 'Select Open Trello List';
      break;
    case 'closeBoards':
      modalTitle = 'Select Closed Trello Board';
      break;
    case 'closeLists':
      modalTitle = 'Select Closed Trello List';
      break;
    default:
      modalTitle = 'Trello';
  }
  return modalTitle;
};

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../common/Modal/styles.module.scss';
import MobileHeader from '../../../common/MobileHeader';
import CheckedIcon from '../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../public/icons/sparkle/not-checked.svg';
import ChevronIcon from '../../../public/icons/ios/chevron-left.svg';
import useSearching from '../../../common/hooks/useSearching';

interface Options {
  openBoard: string;
  openList: string;
  closeBoard: string;
  closeList: string;
}

interface Props extends ModalProps {
  onClose: () => void;
  isOnline?: boolean;
  isStaging?: boolean;
  selectedOptions: Options;
  options: any;
  onSelect: (any) => void;
  activeSelection: string;
}

const SelectionModal: FunctionComponent<Props> = ({
  onClose,
  isOnline,
  isStaging,
  selectedOptions,
  options,
  onSelect,
  activeSelection
}) => {
  const headerActions = () => (
    <>
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
    </>
  );

  // Checks for single selected option
  const singularizedActiveSelection = activeSelection.replace(/s$/, '');
  const selectedOption = selectedOptions[singularizedActiveSelection];

  // Checks for options list to show
  const optionsToSelect = options[activeSelection];
  // Options search setup
  const { onSearchKeyDown, filteredItems, searchParam } = useSearching(
    optionsToSelect,
    ['name']
  );

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

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        actions={headerActions}
        isStaging={isStaging}
        title={modalTitle}
        data-testid="selection-modal"
      />
      <label className={styles.trelloSelectionModal__search}>
        <input
          placeholder="Search"
          className={styles.trelloSelectionModal__search__input}
          type="search"
          defaultValue={searchParam}
          onKeyDown={onSearchKeyDown}
          data-testid="templates-search-box"
        />
      </label>

      <ul>
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <li className={styles.trelloSelectionModal__items} key={item.id}>
              <input
                type="checkbox"
                id={item.id}
                data-testid={`checkbox-item-${item.id}`}
                className={styles.trelloSelectionModal__items__input}
                checked={selectedOption.id === item.id}
                onChange={() => onSelect(item)}
                value={item.id}
              />
              <label
                htmlFor={item.id}
                className={clsx(
                  styles.trelloSelectionModal__items__label,
                  ['-ml-none', '-d-flex'],
                  selectedOption.id === item.id && styles['-isChecked']
                )}
              >
                <div>{item.name}</div>
                {selectedOption.id === item.id ? (
                  <CheckedIcon
                    className={styles.trelloSelectionModal__items__label__icon}
                  />
                ) : (
                  <NotCheckedIcon
                    className={styles.trelloSelectionModal__items__label__icon}
                  />
                )}
              </label>
            </li>
          ))
        ) : (
          <h5
            data-testid="no-templates"
            className={styles.trelloSelectionModal__emptyHeading}
          >
            No search results
          </h5>
        )}
      </ul>
    </>
  );
};

export default Modal(SelectionModal, false, styles.trelloSelectionModal);

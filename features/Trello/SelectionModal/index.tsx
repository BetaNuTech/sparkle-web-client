import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import modalStyles from '../../../common/Modal/styles.module.scss';
import headerStyles from '../../../common/MobileHeader/styles.module.scss';
import MobileHeader from '../../../common/MobileHeader';
import CheckedIcon from '../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../public/icons/sparkle/not-checked.svg';
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
  isSelecting: string;
}

const SelectionModal: FunctionComponent<Props> = ({
  onClose,
  isOnline,
  isStaging,
  selectedOptions,
  options,
  onSelect,
  isSelecting
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
        ×
      </button>
    </>
  );

  // Checks for single selected option
  const selectedOption = selectedOptions[isSelecting.slice(0, -1)];

  // Checks for options list to show
  const optionsToSelect = options[isSelecting];
  // Options search setup
  const { onSearchKeyDown, filteredItems, searchParam } = useSearching(
    optionsToSelect,
    ['name']
  );

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        actions={headerActions}
        isStaging={isStaging}
        title="Trello Setup"
        className={clsx(headerStyles['header--displayOnDesktop'])}
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
        {filteredItems &&
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
          ))}
      </ul>
    </>
  );
};

export default Modal(SelectionModal, false, styles.trelloSelectionModal);

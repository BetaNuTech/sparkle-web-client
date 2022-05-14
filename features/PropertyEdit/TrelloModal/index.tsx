import clsx from 'clsx';
import { FunctionComponent, useEffect, useState } from 'react';
import { useFirestore } from 'reactfire';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import modalStyles from '../../../common/Modal/styles.module.scss';
import propertyModel from '../../../common/models/property';
import TrelloIntegrationModel from '../../../common/models/trelloIntegration';
import useTrelloProperty from '../../../common/hooks/useTrelloProperty';
import SkeletonLoader from '../../../common/SkeletonLoader';
import useTrelloBoards from '../hooks/useTrelloBoards';
import usePropertyTrelloSelection from '../hooks/usePropertyTrelloSelection';
import SelectionGroup from './SelectionGroup';
import SelectionModal from './SelectionModal';
import useTrelloLists from '../hooks/useTrelloLists';
import styles from './styles.module.scss';
import { Selection } from '../hooks/useTrelloActions';

type UserNotifications = (message: string, options?: any) => any;

interface Props extends ModalProps {
  onClose: () => void;
  property: propertyModel;
  trelloIntegration: TrelloIntegrationModel;
  hasUpdateCompanySettingsPermission: boolean;
  onSave: (selection: Selection) => void;
  onReset: () => void;
  onLoadDataError: () => void;
  sendNotification: UserNotifications;
  isSaving: boolean;
  isResetting: boolean;
}

const TrelloModal: FunctionComponent<Props> = ({
  onClose,
  trelloIntegration,
  property,
  onSave,
  onReset,
  onLoadDataError,
  sendNotification,
  isSaving,
  isResetting
}) => {
  const firestore = useFirestore();

  // Open & Close Selection Modal
  const [isSelectionModalVisible, setSelectionModalVisible] = useState(false);

  const [activeSelection, setActiveSelection] = useState('');

  // Load Trello data for property
  const {
    data: trelloProperty,
    status: trelloPropertyStatus,
    error: trelloPropertyError
  } = useTrelloProperty(firestore, property.id);

  // Load Boards
  const {
    data: trelloBoards,
    status: trelloBoardsStatus,
    error: boardsError
  } = useTrelloBoards();

  // Handle Selection
  const {
    handleboardSelection,
    onSelect,
    selectedOptions,
    hasSelectionChange,
    resetSelection
  } = usePropertyTrelloSelection(trelloProperty || {}, activeSelection);

  // Load Lists
  const {
    isOpenLoading: isOpenListsLoading,
    isClosedLoading: isClosedListsLoading,
    openLists,
    closeLists,
    findLists
  } = useTrelloLists(
    (trelloProperty && trelloProperty.openBoard) || '',
    (trelloProperty && trelloProperty.closedBoard) || '',
    sendNotification
  );

  const [options, setOptions] = useState({
    openBoards: trelloBoards,
    closeBoards: trelloBoards,
    openLists,
    closeLists
  });

  useEffect(() => {
    setOptions({
      openBoards: trelloBoards,
      closeBoards: trelloBoards,
      openLists,
      closeLists
    });
  }, [trelloBoards, openLists, closeLists]);

  // Opens selection modal and asign options
  const openSelectionModal = (option: string) => {
    setActiveSelection(option);
    setSelectionModalVisible(true);
  };

  // Close selection modal and get lists for selected board
  const closeSelectionModal = () => {
    setSelectionModalVisible(false);
    handleboardSelection(findLists);
  };

  const { openBoard, openList, closeBoard, closeList } = selectedOptions;
  const { trelloFullName, trelloUsername } = trelloIntegration;

  const reset = () => {
    onReset();
    resetSelection();
  };

  // invoke method to close modal
  // and send user facing notification
  // on error in loading data
  useEffect(() => {
    if (trelloPropertyError || boardsError) {
      onLoadDataError();
    }
  }, [trelloPropertyError, boardsError, onLoadDataError]);

  const isLoaded =
    trelloPropertyStatus === 'success' && trelloBoardsStatus === 'success';

  const hasTrelloIntegration = Boolean(
    trelloProperty?.openBoard || trelloProperty?.closedBoard
  );

  const showReset = hasTrelloIntegration || hasSelectionChange;

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
            modalStyles['-topLeft'],
            styles.headerButton
          )}
          data-testid="close"
        >
          ×
        </button>
        <h4>Trello</h4>
        <button
          data-testid="save-button"
          className={clsx(styles.headerButton, modalStyles['-topLeft'])}
          disabled={!hasSelectionChange || isSaving}
          onClick={() => onSave(selectedOptions)}
        >
          {isSaving ? (
            <span className={styles.isLoading}>Updating...</span>
          ) : (
            'Save'
          )}
        </button>
      </header>
      {!isLoaded && (
        <SkeletonLoader rows={4} className="-pl -pr -mt -heightAuto" />
      )}
      {trelloIntegration && isLoaded && (
        <>
          <div className={modalStyles.modal__main}>
            <h5
              className={styles.subHeading}
            >{`${trelloFullName} (${trelloUsername})`}</h5>
            <SelectionGroup
              title="Deficient Item - OPEN"
              board={openBoard}
              list={openList}
              status="open"
              openSelectionModal={openSelectionModal}
              isLoadingLists={isOpenListsLoading}
              isSaving={isSaving || isResetting}
            />
            <SelectionGroup
              title="Deficient Item - CLOSED"
              board={closeBoard}
              list={closeList}
              status="close"
              openSelectionModal={openSelectionModal}
              isLoadingLists={isClosedListsLoading}
              isSaving={isSaving || isResetting}
            />
          </div>
          <footer
            className={clsx(
              modalStyles.modal__main__footer,
              '-jc-center',
              '-bgc-white'
            )}
          >
            {showReset && (
              <button onClick={reset} className={styles.cancelButton}>
                {isResetting ? (
                  <span className={styles.isLoading}>Loading...</span>
                ) : (
                  'RESET'
                )}
              </button>
            )}
          </footer>
          <SelectionModal
            isVisible={isSelectionModalVisible}
            onClose={closeSelectionModal}
            activeSelection={activeSelection}
            selectedOptions={selectedOptions}
            options={options}
            onSelect={onSelect}
          />
        </>
      )}
    </>
  );
};

export default Modal(TrelloModal, false, styles.container);

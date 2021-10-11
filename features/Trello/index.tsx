import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import TrelloModal from './TrelloModal/index';
import SelectionModal from './SelectionModal/index';
import { trelloBoard } from '../../common/services/api/trello';
import trelloUserModel from '../../common/models/trelloUser';
import propertyTrelloIntegrationModel from '../../common/models/propertyTrelloIntegration';
import useTrelloSave from './hooks/useTrelloSave';
import useTrelloLists from './hooks/useTrelloLists';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import propertyModel from '../../common/models/property';
import LoadingHud from '../../common/LoadingHud';

interface Props {
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
  trelloUser: trelloUserModel;
  trelloProperty: propertyTrelloIntegrationModel;
  trelloBoards: trelloBoard[];
  hasUpdateCompanySettingsPermission: boolean;
  redirectToProperty: () => void;
}

interface selected {
  openBoard: { name: string; id: string };
  openList: { name: string; id: string };
  closeBoard: { name: string; id: string };
  closeList: { name: string; id: string };
}

const Trello: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  trelloUser,
  trelloProperty,
  trelloBoards,
  hasUpdateCompanySettingsPermission,
  redirectToProperty
}) => {
  const firestore = useFirestore();
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */
  const { isLoading: isSaving, updateTrelloIntegration } = useTrelloSave(
    firestore,
    sendNotification
  );
  // Selected Options State
  const {
    closedBoard,
    closedBoardName,
    closedList,
    closedListName,
    openBoard,
    openBoardName,
    openList,
    openListName
  } = trelloProperty;

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
    useNotifications
  );

  const [selectedOptions, setselectedOptions] = useState<selected>({
    openBoard: { id: openBoard, name: openBoardName },
    openList: { id: openList, name: openListName },
    closeBoard: { id: closedBoard, name: closedBoardName },
    closeList: { id: closedList, name: closedListName }
  });

  // Open & Close Trello Modal
  const [isTrelloModalVisible, setTrelloModalVisible] = useState(true);
  // Open & Close Selection Modal
  const [isSelectionModalVisible, setSelectionModalVisible] = useState(false);

  const [isSelecting, setIsSelecting] = useState('');
  const [options, setOptions] = useState({
    openBoards: trelloBoards,
    closeBoards: trelloBoards,
    openLists,
    closeLists
  });

  if (openLists !== options.openLists || closeLists !== options.closeLists) {
    setOptions({ ...options, openLists, closeLists });
  }

  const emptyOption = { name: null, id: null };

  // Check for selection changes
  const [hasSelectionChange, setHasSelectionChange] = useState(false);

  const closeTrelloModal = () => {
    setTrelloModalVisible(false);
    redirectToProperty();
  };

  // Opens selection modal and asign options
  const openSelectionModal = (option) => {
    setIsSelecting(option);
    setSelectionModalVisible(!isSelectionModalVisible);
  };

  // Close selection modal and get lists for selected board
  const closeSelectionModal = () => {
    setSelectionModalVisible(!isSelectionModalVisible);
    if (isSelecting === 'openBoards') {
      findLists(selectedOptions.openBoard.id, true);
      setselectedOptions({ ...selectedOptions, openList: emptyOption });
    } else if (isSelecting === 'closeBoards') {
      findLists(selectedOptions.closeBoard.id, false);
      setselectedOptions({ ...selectedOptions, closeList: emptyOption });
    }
  };

  // Checks if a selection is already selected and updates state
  const onSelect = (selection: { name: string; id: string }) => {
    const singleOption = isSelecting.slice(0, -1);
    const isAlreadySelected = selectedOptions[singleOption] === selection;
    setHasSelectionChange(true);

    setselectedOptions({
      ...selectedOptions,
      [singleOption]: isAlreadySelected ? emptyOption : selection
    });
  };

  // Persist updates to Property's
  // trello integration
  const onSave = () => updateTrelloIntegration(property.id, selectedOptions);

  // Remove all Property's
  // trello integration details
  const onReset = () =>
    updateTrelloIntegration(property.id, {
      openBoard: { name: '', id: '' },
      openList: { name: '', id: '' },
      closeBoard: { name: '', id: '' },
      closeList: { name: '', id: '' }
    });

  return isSaving ? (
    <LoadingHud />
  ) : (
    <>
      <TrelloModal
        isVisible={isTrelloModalVisible}
        onClose={closeTrelloModal}
        isOnline={isOnline}
        isStaging={isStaging}
        property={property}
        selectedOptions={selectedOptions}
        trelloUser={trelloUser}
        trelloBoards={trelloBoards}
        hasUpdateCompanySettingsPermission={hasUpdateCompanySettingsPermission}
        openSelectionModal={openSelectionModal}
        isOpenListsLoading={isOpenListsLoading}
        isClosedListsLoading={isClosedListsLoading}
        hasSelectionChange={hasSelectionChange}
        onSave={onSave}
        onReset={onReset}
      />
      <SelectionModal
        isVisible={isSelectionModalVisible}
        onClose={closeSelectionModal}
        isOnline={isOnline}
        isStaging={isStaging}
        selectedOptions={selectedOptions}
        options={options}
        onSelect={onSelect}
        isSelecting={isSelecting}
      />
    </>
  );
};

Trello.defaultProps = {
  isOnline: false,
  isStaging: false
};

export default Trello;

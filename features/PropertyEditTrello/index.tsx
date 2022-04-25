import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import TrelloModal from './Modal/index';
import SelectionModal from './SelectionModal/index';
import { trelloBoard } from '../../common/services/api/trello';
import TrelloIntegrationModel from '../../common/models/trelloIntegration';
import propertyTrelloIntegrationModel from '../../common/models/propertyTrelloIntegration';
import useTrelloSave from './hooks/useTrelloSave';
import useTrelloLists from './hooks/useTrelloLists';
import usePropertyTrelloSelection from './hooks/usePropertyTrelloSelection';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import propertyModel from '../../common/models/property';
import userModel from '../../common/models/user';
import LoadingHud from '../../common/LoadingHud';

interface Props {
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
  trelloUser: TrelloIntegrationModel;
  trelloProperty: propertyTrelloIntegrationModel;
  trelloBoards: trelloBoard[];
  hasUpdateCompanySettingsPermission: boolean;
  redirectToProperty: () => void;
  user: userModel;
}

const PropertyEditTrello: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  trelloUser,
  trelloProperty,
  trelloBoards,
  hasUpdateCompanySettingsPermission,
  user,
  redirectToProperty
}) => {
  const firestore = useFirestore();
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */
  const { isLoading: isSaving, updateTrelloIntegration } = useTrelloSave(
    firestore,
    sendNotification,
    user
  );

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

  // Open & Close Trello Modal
  const [isTrelloModalVisible, setTrelloModalVisible] = useState(true);
  // Open & Close Selection Modal
  const [isSelectionModalVisible, setSelectionModalVisible] = useState(false);

  const [activeSelection, setActiveSelection] = useState('');
  const [options, setOptions] = useState({
    openBoards: trelloBoards,
    closeBoards: trelloBoards,
    openLists,
    closeLists
  });

  if (openLists !== options.openLists || closeLists !== options.closeLists) {
    setOptions({ ...options, openLists, closeLists });
  }

  const closeTrelloModal = () => {
    setTrelloModalVisible(false);
    redirectToProperty();
  };

  // Opens selection modal and asign options
  const openSelectionModal = (option) => {
    setActiveSelection(option);
    setSelectionModalVisible(!isSelectionModalVisible);
  };

  // Handle Selection
  const {
    handleboardSelection,
    onSelect,
    selectedOptions,
    hasSelectionChange
  } = usePropertyTrelloSelection(trelloProperty, activeSelection);

  // Close selection modal and get lists for selected board
  const closeSelectionModal = () => {
    setSelectionModalVisible(!isSelectionModalVisible);
    handleboardSelection(findLists);
  };

  // Persist updates to Property's
  // trello integration
  const onSave = () =>
    updateTrelloIntegration(property.id, selectedOptions, trelloProperty);

  // Remove all Property's
  // trello integration details
  const onReset = () =>
    updateTrelloIntegration(
      property.id,
      {
        openBoard: { name: '', id: '' },
        openList: { name: '', id: '' },
        closeBoard: { name: '', id: '' },
        closeList: { name: '', id: '' }
      },
      trelloProperty
    );

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
        activeSelection={activeSelection}
      />
    </>
  );
};

PropertyEditTrello.defaultProps = {
  isOnline: false,
  isStaging: false
};

export default PropertyEditTrello;

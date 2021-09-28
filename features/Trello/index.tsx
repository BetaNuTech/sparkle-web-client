import { FunctionComponent, useState } from 'react';
import Router from 'next/router';
import TrelloModal from './TrelloModal/index';
import { trelloBoard } from '../../common/services/api/trello';
import trelloUserModel from '../../common/models/trelloUser';
import trelloUserProperty from '../../common/models/trelloProperty';

interface Props {
  property: any;
  isOnline?: boolean;
  isStaging?: boolean;
  trelloUser: trelloUserModel;
  trelloProperty: trelloUserProperty;
  trelloBoards: trelloBoard;
  hasUpdateCompanySettingsPermission: boolean;
}

const Trello: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  trelloUser,
  trelloProperty,
  trelloBoards,
  hasUpdateCompanySettingsPermission
}) => {
  // Open & Close Trello Modal
  const [isTrelloModalVisible, setTrelloModalVisible] = useState(true);

  const closeTrelloModal = () => {
    setTrelloModalVisible(false);
  };

  // Redirect to property edit form on close
  if (!isTrelloModalVisible) {
    Router.push(`/properties/edit/${property.id}`);
  }

  const { closedBoardName, closedListName, openBoardName, openListName } =
    trelloProperty;

  // Selected Options State
  /* eslint-disable */
  const [selectedOptions, setselectedOptions] = useState({
    openBoard: openBoardName || 'Not Set',
    openList: openListName || 'Not Set',
    closedBoard: closedBoardName || 'Not Set',
    closedList: closedListName || 'Not Set'
  });
  /* eslint-enable */

  return (
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
      />
    </>
  );
};

export default Trello;

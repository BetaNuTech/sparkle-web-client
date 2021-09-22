import { FunctionComponent, useState } from 'react';
import Router from 'next/router';
import TrelloModal from './TrelloModal/index';

interface Props {
  property: any;
  isOnline?: boolean;
  isStaging?: boolean;
}

const Trello: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging
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

  // Selected Options State
  /* eslint-disable */
  const [selectedOptions, setselectedOptions] = useState({
    openBoard: 'Not Set',
    openList: 'Not Set',
    closedBoard: 'Not Set',
    closedList: 'Not Set'
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
      />
    </>
  );
};

export default Trello;

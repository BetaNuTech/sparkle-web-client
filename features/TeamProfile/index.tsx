import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import useDeleteProperty from '../../common/hooks/useDeleteProperty';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import teamModel from '../../common/models/team';
import notifications from '../../common/services/notifications';
import breakpoints from '../../config/breakpoints';
import Header from '../../common/Properties/Header';
import usePropertiesSorting from '../../common/hooks/properties/useSorting';
import PropertyList from '../../common/Properties/List';
import PropertyGrid from '../../common/Properties/Grid';
import Container from '../../common/Properties/Container';

interface Props {
  user: userModel;
  team: teamModel;
  properties: Array<propertyModel>;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  propertiesMemo: string;
}

const TeamProfile: FunctionComponent<Props> = ({
  user,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible,
  team,
  properties,
  propertiesMemo
}) => {
  const firestore = useFirestore();

  // Sort team's properties
  const {
    sortedProperties,
    sortDir,
    sortBy,
    userFacingSortBy,
    nextPropertiesSort,
    onSortChange
  } = usePropertiesSorting(properties, propertiesMemo);

  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Queue and Delete Property
  const [isDeletePropertyPromptVisible, setDeletePropertyPromptVisible] =
    useState(false);
  const { queuePropertyForDelete, confirmPropertyDelete } = useDeleteProperty(
    firestore,
    sendNotification,
    user
  );
  const openPropertyDeletePrompt = (property: propertyModel) => {
    queuePropertyForDelete(property);
    setDeletePropertyPromptVisible(true);
  };
  const closeDeletePropertyPrompt = () => {
    setDeletePropertyPromptVisible(false);
    queuePropertyForDelete(null);
  };

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const header = (
    <Header
      sortBy={sortBy}
      sortDir={sortDir}
      onSortChange={onSortChange}
      headerTitle={team.name}
      canAddTeam={false}
      canAddProperty={false}
    />
  );

  const grid = (
    <PropertyGrid properties={sortedProperties} forceVisible={forceVisible} />
  );

  return (
    <>
      {isMobileorTablet && (
        <PropertyList
          properties={sortedProperties}
          isDeletePropertyPromptVisible={isDeletePropertyPromptVisible}
          confirmPropertyDelete={confirmPropertyDelete}
          openPropertyDeletePrompt={openPropertyDeletePrompt}
          closeDeletePropertyPrompt={closeDeletePropertyPrompt}
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          nextPropertiesSort={nextPropertiesSort}
          userFacingSortBy={userFacingSortBy}
          forceVisible={forceVisible}
          headerTitle={team.name}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && <Container header={header} grid={grid} />}
    </>
  );
};

TeamProfile.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default TeamProfile;

import { FunctionComponent, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import calculateTeamValues from './utils/calculateTeamValues';
import { activePropertiesSortFilter } from './utils/propertiesSorting';
import useDeleteProperty from '../../common/hooks/useDeleteProperty';
import useDeleteTeam from './hooks/useDeleteTeam';
import usePropertiesSorting from '../../common/Properties/hooks/usePropertiesSorting';
import {
  canCreateTeam,
  canCreateProperty
} from '../../common/utils/userPermissions';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import teamModel from '../../common/models/team';
import notifications from '../../common/services/notifications';
import breakpoints from '../../config/breakpoints';
import Container from '../../common/Properties/Container';
import Header from '../../common/Properties/Header';
import Sidebar from './Sidebar';
import DeleteTeamPrompt from './DeleteTeamPrompt';
import PropertyList from '../../common/Properties/List';
import PropertyGrid from '../../common/Properties/Grid';

interface PropertiesModel {
  user: userModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  properties: propertyModel[];
  propertiesMemo: string;
  teams: teamModel[];
  teamsMemo: string;
}

const Properties: FunctionComponent<PropertiesModel> = ({
  user,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible,
  properties,
  propertiesMemo,
  teams,
  teamsMemo
}) => {
  const firestore = useFirestore();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);

  // Lookup user permissions
  const hasCreateTeamPermission = canCreateTeam(user);
  const hasCreatePropertyPermission = canCreateProperty(user);

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

  // Sort properties
  const {
    sortedProperties,
    sortDir,
    sortBy,
    nextPropertiesSort,
    onSortChange
  } = usePropertiesSorting(properties, propertiesMemo);

  // Queue and Delete Team
  const [isDeleteTeamPromptVisible, setDeleteTeamPromptVisible] =
    useState(false);
  const { queueTeamForDelete, confirmTeamDelete } = useDeleteTeam(
    firestore,
    sendNotification,
    user
  );
  const openTeamDeletePrompt = (team: teamModel) => {
    queueTeamForDelete(team);
    setDeleteTeamPromptVisible(true);
  };
  const closeDeleteTeamPrompt = () => {
    setDeleteTeamPromptVisible(false);
    queueTeamForDelete(null);
  };

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Update team calculated values
  useEffect(() => {
    function recalcTeamComputedValues() {
      setTeamCalculatedValues(calculateTeamValues(teams, properties));
    }

    recalcTeamComputedValues();
  }, [teamsMemo, propertiesMemo]); // eslint-disable-line

  const header = (
    <Header
      sortBy={sortBy}
      sortDir={sortDir}
      onSortChange={onSortChange}
      canAddTeam={hasCreateTeamPermission}
      canAddProperty={hasCreatePropertyPermission}
    />
  );

  const grid = (
    <PropertyGrid properties={sortedProperties} forceVisible={forceVisible} />
  );

  const sidebar = (
    <Sidebar
      teams={teams}
      openTeamDeletePrompt={openTeamDeletePrompt}
      teamCalculatedValues={teamCalculatedValues}
    />
  );

  return (
    <>
      {isMobileorTablet && (
        <PropertyList
          properties={sortedProperties}
          teams={teams}
          teamCalculatedValues={teamCalculatedValues}
          isDeletePropertyPromptVisible={isDeletePropertyPromptVisible}
          confirmPropertyDelete={confirmPropertyDelete}
          openPropertyDeletePrompt={openPropertyDeletePrompt}
          closeDeletePropertyPrompt={closeDeletePropertyPrompt}
          openTeamDeletePrompt={openTeamDeletePrompt}
          isOnline={isOnline}
          isStaging={isStaging}
          canAddTeam={hasCreateTeamPermission}
          canAddProperty={hasCreatePropertyPermission}
          toggleNavOpen={toggleNavOpen}
          nextPropertiesSort={nextPropertiesSort}
          sortBy={sortBy}
          activePropertiesSortFilter={activePropertiesSortFilter}
          forceVisible={forceVisible}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && <Container header={header} grid={grid} sidebar={sidebar} />}

      <DeleteTeamPrompt
        isVisible={isDeleteTeamPromptVisible}
        onClose={closeDeleteTeamPrompt}
        onConfirm={confirmTeamDelete}
      />
    </>
  );
};

Properties.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default Properties;

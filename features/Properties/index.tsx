import { FunctionComponent, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import calculateTeamValues from './utils/calculateTeamValues';
import useDeleteProperty from '../../common/hooks/useDeleteProperty';
import useDeleteTeam from './hooks/useDeleteTeam';
import usePropertiesSorting from '../../common/hooks/properties/useSorting';
import {
  canCreateTeam,
  canCreateProperty,
  canEditProperty
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
import AddTeamPrompt from './AddTeamPrompt';
import useTeamForm from './hooks/useTeamForm';

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
  const hasEditPropertyAccess = canEditProperty(user);

  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  const {
    createTeam,
    isLoading,
    errors,
    isVisible: isAddTeamPromptVisible,
    setIsVisible: setIsAddTeamPromptVisible
  } = useTeamForm(sendNotification);

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
    userFacingSortBy,
    nextPropertiesSort,
    onSortChange
  } = usePropertiesSorting(properties, propertiesMemo);

  // Queue and Delete Team
  const [isDeleteTeamPromptVisible, setDeleteTeamPromptVisible] =
    useState(false);
  const { queueTeamForDelete, confirmTeamDelete } =
    useDeleteTeam(sendNotification);
  const openTeamDeletePrompt = (team: teamModel) => {
    queueTeamForDelete(team);
    setDeleteTeamPromptVisible(true);
  };
  const closeDeleteTeamPrompt = () => {
    setDeleteTeamPromptVisible(false);
    queueTeamForDelete(null);
  };

  const onCreateTeam = (teamName: string) => {
    createTeam({ name: teamName });
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
      onAddTeam={() => setIsAddTeamPromptVisible(true)}
    />
  );

  const grid = (
    <PropertyGrid
      properties={sortedProperties}
      forceVisible={forceVisible}
      hasEditPropertyAccess={hasEditPropertyAccess}
    />
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
          userFacingSortBy={userFacingSortBy}
          forceVisible={forceVisible}
          hasEditPropertyAccess={hasEditPropertyAccess}
          onAddTeam={() => setIsAddTeamPromptVisible(true)}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && <Container header={header} grid={grid} sidebar={sidebar} />}

      <DeleteTeamPrompt
        isVisible={isDeleteTeamPromptVisible}
        onClose={closeDeleteTeamPrompt}
        onConfirm={confirmTeamDelete}
      />
      <AddTeamPrompt
        isVisible={isAddTeamPromptVisible}
        onClose={() => setIsAddTeamPromptVisible(false)}
        onConfirm={onCreateTeam}
        isLoading={isLoading}
        errors={errors}
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

import { FunctionComponent, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import calculateTeamValues from './utils/calculateTeamValues';
import {
  sorts,
  activePropertiesSortFilter,
  sortProperties
} from './utils/propertiesSorting';
import { useSortBy, useSortDir } from './hooks/sorting';
import useTeams from './hooks/useTeams';
import useProperties from './hooks/useProperties';
import useDeleteProperty from '../../common/hooks/useDeleteProperty';
import useDeleteTeam from './hooks/useDeleteTeam';
import {
  canCreateTeam,
  canCreateProperty
} from '../../common/utils/userPermissions';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import teamModel from '../../common/models/team';
import notifications from '../../common/services/notifications';
import globalEvents from '../../common/utils/globalEvents';
import breakpoints from '../../config/breakpoints';
import styles from './styles.module.scss';
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileList from './ProfileList';
import MobileLayout from './MobileLayout';
import DeleteTeamPrompt from './DeleteTeamPrompt';

interface PropertiesModel {
  user: userModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
}

const Properties: FunctionComponent<PropertiesModel> = ({
  user,
  isOnline,
  isStaging,
  toggleNavOpen,
  forceVisible
}) => {
  const firestore = useFirestore();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const [sortBy, setSortBy] = useSortBy();
  const [sortDir, setSortDir] = useSortDir();
  const { data: properties, memo: propertiesMemo } = useProperties(
    firestore,
    user
  );
  const {
    status: teamsStatus,
    data: teams,
    memo: teamsMemo
  } = useTeams(firestore, user);
  const [sortedProperties, setSortedProperties] = useState([]);

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

  // Apply properties sort order
  const applyPropertiesSort = () =>
    [...properties].sort(sortProperties(sortBy, sortDir));

  // Update team calculated values
  useEffect(() => {
    function recalcTeamComputedValues() {
      if (teamsStatus === 'success') {
        setTeamCalculatedValues(calculateTeamValues(teams, properties));
      }
    }

    recalcTeamComputedValues();
  }, [teamsStatus, teamsMemo, propertiesMemo]); // eslint-disable-line

  useEffect(() => {
    function resortProperties() {
      setSortedProperties(applyPropertiesSort());
    }

    resortProperties();
  }, [propertiesMemo, sortBy, sortDir]); // eslint-disable-line

  // Loop through property
  // sorting options
  const nextPropertiesSort = () => {
    const activeSortValue = sorts[sorts.indexOf(sortBy) + 1] || sorts[0]; // Get next or first
    const descOrderKeys = ['lastInspectionDate', 'lastInspectionScore'];
    const isDescOrderValue = descOrderKeys.includes(activeSortValue);

    // Check if sort direction is asc then
    // change to desc if it is either lastInspectionDate or lastInspectionScore
    if (isDescOrderValue && sortDir === 'asc') {
      setSortDir('desc');
    } else if (!isDescOrderValue && sortDir === 'desc') {
      // If sort desc and it is other than values
      // in `descOrderKeys` then change to asc
      setSortDir('asc');
    }
    // Update Property sort
    setSortBy(activeSortValue);
    globalEvents.trigger('visibilityForceCheck');
  };

  // Set sort attribute & direction
  const onSortChange = (key: string) => (evt: { target: HTMLInputElement }) => {
    const {
      target: { value }
    } = evt;

    // Update sort direction
    if (key === 'sortDir') {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(value); // Update sort by
    }

    globalEvents.trigger('visibilityForceCheck');
  };

  return (
    <>
      {isMobileorTablet && (
        <MobileLayout
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
      {isDesktop && (
        <div className={styles.properties__container}>
          <Header
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
            canAddTeam={hasCreateTeamPermission}
            canAddProperty={hasCreatePropertyPermission}
          />

          <div className={styles.properties__main}>
            <ProfileList
              properties={sortedProperties}
              forceVisible={forceVisible}
            />
          </div>

          <aside>
            <Sidebar
              teams={teams}
              openTeamDeletePrompt={openTeamDeletePrompt}
              teamCalculatedValues={teamCalculatedValues}
            />
          </aside>
        </div>
      )}

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

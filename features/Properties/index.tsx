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
import useDeleteProperty from './hooks/useDeleteProperty';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import notifications from '../../common/services/notifications'; // eslint-disable-line
import breakpoints from '../../config/breakpoints';
import styles from './styles.module.scss';
import Header from './Header';
import Sidebar from './Sidebar';
import { ProfileList } from './ProfileList';
import { MobileHeader } from './MobileHeader';
import MobileLayout from './MobileLayout';

interface PropertiesModel {
  user: userModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const Properties: FunctionComponent<PropertiesModel> = ({
  user,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const [sortBy, setSortBy] = useSortBy();
  const [sortDir, setSortDir] = useSortDir();
  const { data: properties, memo: propertiesMemo } = useProperties(user);
  const { status: teamsStatus, data: teams, memo: teamsMemo } = useTeams(user);
  const [sortedProperties, setSortedProperties] = useState([]);

  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Queue and Delete Property
  const [isDeletePropertyPromptVisible, setDeletePropertyPromptVisible] =
    useState(false);
  const { queuePropertyForDelete, confirmPropertyDelete } = useDeleteProperty(
    firestore,
    sendNotification
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

    // Update Property sort
    setSortBy(activeSortValue);
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
  };

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title="Properties"
            toggleNavOpen={toggleNavOpen}
            nextPropertiesSort={nextPropertiesSort}
            isOnline={isOnline}
            isStaging={isStaging}
          />

          <div
            className={styles.properties__sortInfoLine}
            data-testid="properties-active-sort-by"
          >
            {`Sorted by ${activePropertiesSortFilter(sortBy)}`}
          </div>

          <MobileLayout
            properties={sortedProperties}
            teams={teams}
            teamCalculatedValues={teamCalculatedValues}
            isDeletePropertyPromptVisible={isDeletePropertyPromptVisible}
            confirmPropertyDelete={confirmPropertyDelete}
            openPropertyDeletePrompt={openPropertyDeletePrompt}
            closeDeletePropertyPrompt={closeDeletePropertyPrompt}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.properties__container}>
          <Header
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
          />

          <div className={styles.properties__main}>
            <ProfileList properties={sortedProperties} />
          </div>

          <aside>
            <Sidebar
              teams={teams}
              teamCalculatedValues={teamCalculatedValues}
            />
          </aside>
        </div>
      )}
    </>
  );
};

Properties.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default Properties;

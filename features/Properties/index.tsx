import { FunctionComponent, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import calculateTeamValues from './utils/calculateTeamValues';
import {
  sorts,
  activePropertiesSortFilter,
  sortProperties
} from './utils/propertiesSorting';
import { useSortBy, useSortDir } from './hooks/sorting';
import useTeams from './hooks/useTeams';
import useProperties from './hooks/useProperties';
import styles from './styles.module.scss';
import Header from './Header';
import Sidebar from './Sidebar';
import { ProfileList } from './ProfileList';
import { MobileHeader } from './MobileHeader';
import MobileLayout from './MobileLayout';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';

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
  // const dispatch = useDispatch();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const [sortBy, setSortBy] = useSortBy();
  const [sortDir, setSortDir] = useSortDir();
  // const properties = useSelector(selectItemsOfProperties);
  const { data: properties } = useProperties(user);
  const { status: teamsStatus, data: teams } = useTeams(user);
  const [sortedProperties, setSortedProperties] = useState([]);
  const teamsMemo = JSON.stringify(teams);
  // Collect all property meta data attributes
  const propertiesMetaMemo = JSON.stringify(
    properties.map(
      ({
        id,
        numOfDeficientItems,
        numOfFollowUpActionsForDeficientItems,
        numOfRequiredActionsForDeficientItems
      }) => ({
        id,
        numOfDeficientItems,
        numOfFollowUpActionsForDeficientItems,
        numOfRequiredActionsForDeficientItems
      })
    )
  );

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
      if (teamsStatus === 'success') {
        setTeamCalculatedValues(
          calculateTeamValues(
            JSON.parse(teamsMemo),
            JSON.parse(propertiesMetaMemo)
          )
        );
      }
    }

    recalcTeamComputedValues();
  }, [teamsStatus, teamsMemo, propertiesMetaMemo]);

  // Apply properties sort order
  useEffect(() => {
    const applyPropertiesSort = () =>
      [...properties].sort(sortProperties(sortBy, sortDir));

    function resortProperties() {
      setSortedProperties(applyPropertiesSort());
    }

    resortProperties();
  }, [properties, sortBy, sortDir]);

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

          <div className={styles.properties__mobile}>
            <MobileLayout
              properties={sortedProperties}
              teams={teams}
              teamCalculatedValues={teamCalculatedValues}
            />
          </div>
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

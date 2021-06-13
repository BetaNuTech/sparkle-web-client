import { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { calculateTeamValues } from '../../common/utils/calculateTeamValues';
import {
  sorts,
  activePropertiesSortFilter,
  sortProperties
} from './utils/propertiesSorting';
import { fetchDataOfProperties } from '../../app/ducks/properties/actionCreators';
import { selectItemsOfProperties } from '../../app/ducks/properties/selectors';
import { fetchDataOfTeams } from '../../app/ducks/teams/actionCreators';
import { selectItemsOfTeams } from '../../app/ducks/teams/selectors';
import { useSortBy, useSortDir } from './hooks/sorting';
import styles from './Properties.module.scss';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProfileList } from './ProfileList';
import { MobileHeader } from './MobileHeader';
import { MobileProperties } from './MobileProperties';
import breakpoints from '../../config/breakpoints';

type PropertiesModel = {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
};

const Properties: FunctionComponent<PropertiesModel> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const dispatch = useDispatch();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const [sortBy, setSortBy] = useSortBy();
  const [sortDir, setSortDir] = useSortDir();
  const properties = useSelector(selectItemsOfProperties);
  const applyPropertiesSort = () =>
    [...properties].sort(sortProperties(sortBy, sortDir));
  const [sortedProperties, setSortedProperties] = useState([]);
  const teams = useSelector(selectItemsOfTeams);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Fetch data only if store with properties is empty.
  // When we switch the page with full store, it doesn't fetch.
  useEffect(() => {
    dispatch(fetchDataOfTeams());

    if (properties.length === 0) {
      dispatch(fetchDataOfProperties());
    }
  }, []);

  // Recalculate properties when properties or teams changes.
  useEffect(() => {
    setTeamCalculatedValues(calculateTeamValues(teams, properties));
    setSortedProperties(applyPropertiesSort());
  }, [properties, teams, sortBy, sortDir, isMobileorTablet]);

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
            <MobileProperties
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

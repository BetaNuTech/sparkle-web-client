import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTeamValues } from '../../common/utils/calculateTeamValues';
import {
  sorts,
  activePropertiesSortFilter,
  sortProperties
} from '../../common/utils/propertiesSorting';
import {
  fetchDataOfProperties,
  setDataOfProperties,
  setActiveSortOfProperties
} from '../../app/ducks/properties/actionCreators';
import {
  selectActiveSortOfProperties,
  selectItemsOfProperties
} from '../../app/ducks/properties/selectors';
import { fetchDataOfTeams } from '../../app/ducks/teams/actionCreators';
import { selectItemsOfTeams } from '../../app/ducks/teams/selectors';
import styles from './Properties.module.scss';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProfileList } from './ProfileList';
import { MobileHeader } from './MobileHeader';
import { MobileProperties } from './MobileProperties';

export const Properties = ({
  isOnline,
  isStaging,
  isNavOpen,
  toggleNavOpen
}) => {
  const dispatch = useDispatch();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const activeSort = useSelector(selectActiveSortOfProperties);
  const activeSortDir = { ...activeSort };
  const properties = useSelector(selectItemsOfProperties);
  const teams = useSelector(selectItemsOfTeams);

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
  }, [properties, teams]);

  // Sort properties active sort and direction
  useEffect(() => {
    dispatch(
      setDataOfProperties(
        [...properties].sort(
          sortProperties(activeSort.sortBy, activeSort.orderBy)
        )
      )
    );
  }, [activeSort]);

  // Loop through property
  // sorting options
  const nextPropertiesSort = () => {
    const activeFilter =
      sorts[sorts.indexOf(activeSort.sortBy) + 1] || sorts[0]; // Get next or first

    // Update Property Filter
    dispatch(
      setActiveSortOfProperties({
        ...activeSort,
        sortBy: activeFilter
      })
    );
  };

  // Set sort attribute & direction
  const onSortChange = (key) => (event) => {
    const {
      target: { value }
    } = event;

    if (key === 'orderBy') {
      // Update orderBy filter
      if (activeSortDir[key] === 'asc') activeSortDir[key] = 'desc';
      else if (activeSortDir[key] === 'desc') activeSortDir[key] = 'asc';
    } else {
      // Update sortBy filter
      activeSortDir[key] = value;
    }

    // Update Property Filter
    dispatch(setActiveSortOfProperties(activeSortDir));
  };

  return (
    <>
      <MobileHeader
        title="Properties"
        isNavOpen={isNavOpen}
        toggleNavOpen={toggleNavOpen}
        nextPropertiesSort={nextPropertiesSort}
        isOnline={isOnline}
        isStaging={isStaging}
      />

      <div className={styles.properties__sortInfoLine}>
        {`Sorted by ${activePropertiesSortFilter(activeSort.sortBy)}`}
      </div>

      <div className={styles.properties__wrapper}>
        <Header activeSort={activeSort} onSortChange={onSortChange} />

        <div className={styles.properties__main}>
          <ProfileList activeSort={activeSort} properties={properties} />
        </div>

        <aside>
          <Sidebar teams={teams} teamCalculatedValues={teamCalculatedValues} />
        </aside>
      </div>

      <div className={styles.properties__mobile}>
        <MobileProperties
          properties={properties}
          teams={teams}
          teamCalculatedValues={teamCalculatedValues}
        />
      </div>
    </>
  );
};

Properties.propTypes = {
  isOnline: PropTypes.bool,
  isStaging: PropTypes.bool,
  isNavOpen: PropTypes.bool,
  toggleNavOpen: PropTypes.func
};

Properties.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {}
};

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateTeamValues } from '../../utils/calculateTeamValues';
import {
  activePropertiesSortFilter,
  sortProperties
} from '../../utils/propertiesSorting';
import {
  fetchDataOfProperties,
  setDataOfProperties
} from '../../redux/ducks/properties/actionCreators';
import {
  selectActiveSortOfProperties,
  selectItemsOfProperties
} from '../../redux/ducks/properties/selectors';
import { fetchDataOfTeams } from '../../redux/ducks/teams/actionCreators';
import { selectItemsOfTeams } from '../../redux/ducks/teams/selectors';
import styles from './Properties.module.scss';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ProfileList } from './ProfileList';
import { MobileProperties } from './MobileProperties';

export const Properties = () => {
  const dispatch = useDispatch();
  const [teamCalculatedValues, setTeamCalculatedValues] = useState([]);
  const activeSort = useSelector(selectActiveSortOfProperties);
  const properties = useSelector(selectItemsOfProperties);
  const teams = useSelector(selectItemsOfTeams);

  // We fetch data only if store with properties is empty.
  // When we switch the page with full store, it doesn't fetch.
  useEffect(() => {
    dispatch(fetchDataOfTeams());

    if (properties.length === 0) {
      dispatch(fetchDataOfProperties());
    }
  }, []);

  // We recalculate properties when properties or teams changes.
  useEffect(() => {
    setTeamCalculatedValues(calculateTeamValues(teams, properties));
  }, [properties, teams]);

  // We sort  properties when activeSort changes.
  useEffect(() => {
    dispatch(
      setDataOfProperties(
        [...properties].sort(
          sortProperties(activeSort.sortBy, activeSort.orderBy)
        )
      )
    );
  }, [activeSort]);

  return (
    <>
      <div className={styles.properties__sortInfoLine}>
        {`Sorted by ${activePropertiesSortFilter(activeSort.sortBy)}`}
      </div>

      <div className={styles.properties__wrapper}>
        <header>
          <Header activeSort={activeSort} properties={properties} />
        </header>

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

import { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/router';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import userModel from '../../../common/models/user';
import MobileHeader from '../../../common/MobileHeader';
import styles from './styles.module.scss';
import List from './List/index';

interface Props {
  user: userModel;
  inspection: inspectionModel;
  teams: Array<any>;
  properties: any;
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
}

const ReasignInspection: FunctionComponent<Props> = ({
  property,
  properties,
  isOnline,
  isStaging,
  teams
}) => {
  const router = useRouter();
  // Handle property selection
  const [selectedProperty, useSelectedProperty] = useState('');
  const changePropertySelection = (newId) => {
    useSelectedProperty(newId);
  };

  // Handle cancel button
  const cancel = (e) => {
    e.preventDefault();
    router.push(`/properties/${property.id}`);
  };

  //   Mobile header save button
  const mobileHeaderActions = () => (
    <div className={styles.reasignInspection__headerActions}>
      <button
        className={styles.reasignInspection__button__cancel}
        onClick={cancel}
        data-testid="cancel-button"
      >
        Cancel
      </button>
      <button
        disabled={!selectedProperty}
        className={styles.reasignInspection__button__done}
        data-testid="save-button"
      >
        Done
      </button>
    </div>
  );

  // Find all properties with a team
  const teamProperties = properties
    .filter((prop) => prop.id !== property.id)
    .filter((prop) => prop.team);

  // All teams with properties
  const teamsIds = teamProperties
    .map(({ team }) => team)
    .filter((team, i, arr) => arr.indexOf(team) === i);

  // Properties to be grouped by NO TEAM
  const noTeamProperties = properties
    .filter((prop) => prop.id !== property.id)
    .filter((prop) => !prop.team);

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-properties-header"
      />
      <div className={styles.reasignInspection__titleContainer}>
        <h5 className={styles.reasignInspection__propertyName}>
          {property.name}
        </h5>
        <h5
          data-testid="reasign-inspection-selected-property"
          className={styles.reasignInspection__selectedProperty}
        >
          {selectedProperty
            ? properties
                .filter((prop) => prop.id === selectedProperty)
                .map((prop) => prop.name)
            : 'NOT SET'}
        </h5>
      </div>

      <List
        teamProperties={teamProperties}
        noTeamProperties={noTeamProperties}
        teams={teams}
        teamsIds={teamsIds}
        changePropertySelection={changePropertySelection}
        selectedProperty={selectedProperty}
      />
    </>
  );
};

export default ReasignInspection;

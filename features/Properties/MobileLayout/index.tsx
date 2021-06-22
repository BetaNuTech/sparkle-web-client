import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import TeamItem from './TeamItem';
import { PropertyItem } from './PropertyItem';
import propertyMetaData from '../../../common/models/propertyMetaData';

interface PropertiesMobileLayoutTeamWrapperModel {
  team: any;
  teamCalculatedValues: Array<propertyMetaData>;
}

interface PropertiesMobileLayoutModel {
  properties: Array<any>;
  teams: Array<any>;
  teamCalculatedValues: Array<propertyMetaData>;
}

// Wrapper around team items
// to look associated property meta data
const MobileLayoutTeamItemWrapper: FunctionComponent<PropertiesMobileLayoutTeamWrapperModel> =
  ({ team, teamCalculatedValues }) => {
    const [propertiesMetaData] = teamCalculatedValues.filter(
      ({ team: teamId }) => teamId === team.id
    );

    return <TeamItem team={team} teamCalculatedValues={propertiesMetaData} />;
  };

// Mobile layout
const MobileLayout: FunctionComponent<PropertiesMobileLayoutModel> = ({
  properties,
  teams,
  teamCalculatedValues
}) => (
  <ul className={styles.mobileProperties} data-testid="mobile-properties-list">
    {teams.length > 0 && (
      <li className={styles.mobileProperties__item}>
        <header>teams</header>
        {teams.map((team) => (
          <MobileLayoutTeamItemWrapper
            key={team.id}
            team={team}
            teamCalculatedValues={teamCalculatedValues}
          />
        ))}
      </li>
    )}

    <li className={styles.mobileProperties__item}>
      <header>properties</header>

      {properties.map((property) => (
        <PropertyItem key={property.id} property={property} />
      ))}
    </li>
  </ul>
);

export default MobileLayout;

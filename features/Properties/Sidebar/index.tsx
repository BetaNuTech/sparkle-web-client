import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import TeamItem from './TeamItem';
import propertyMetaData from '../../../common/models/propertyMetaData';

interface PropertiesSidebarTeamItemWrapperModel {
  team: any;
  teamCalculatedValues: Array<propertyMetaData>;
}

interface PropertiesSidebarLayoutModel {
  teams: Array<any>;
  teamCalculatedValues: Array<propertyMetaData>;
}

// Wrapper around team items
// to lookup properties meta data
const TeamItemWrapper: FunctionComponent<PropertiesSidebarTeamItemWrapperModel> =
  ({ team, teamCalculatedValues }) => {
    const [propertiesMetaData] = teamCalculatedValues.filter(
      ({ team: teamId }) => teamId === team.id
    );

    return <TeamItem team={team} teamCalculatedValues={propertiesMetaData} />;
  };

// Sidebar component
const PropertiesSidebar: FunctionComponent<PropertiesSidebarLayoutModel> = ({
  teams,
  teamCalculatedValues
}) => (
  <nav className={styles.sidebar} data-testid="properties-teams-sidebar">
    <h4 className={styles.sidebar__heading}>Teams</h4>

    <ul className={styles.sidebar__list}>
      {teamCalculatedValues.length &&
        teams.map((team) => (
          <TeamItemWrapper
            key={team.id}
            team={team}
            teamCalculatedValues={teamCalculatedValues}
          />
        ))}
    </ul>
  </nav>
);

export default PropertiesSidebar;

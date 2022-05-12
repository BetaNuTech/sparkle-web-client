import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import TeamItem from './TeamItem';
import propertyMetaData from '../../../common/models/propertyMetaData';
import teamModel from '../../../common/models/team';

interface PropertiesSidebarTeamItemWrapperModel {
  team: any;
  teamCalculatedValues: Array<propertyMetaData>;
  openTeamDeletePrompt: (team: teamModel) => void;
  onEdit(team: teamModel): void;
  canEdit: boolean;
}

interface PropertiesSidebarLayoutModel {
  teams: Array<any>;
  teamCalculatedValues: Array<propertyMetaData>;
  openTeamDeletePrompt: (team: teamModel) => void;
  onEdit(team: teamModel): void;
  canEdit: boolean;
}

// Wrapper around team items
// to lookup properties meta data
const TeamItemWrapper: FunctionComponent<
  PropertiesSidebarTeamItemWrapperModel
> = ({ team, teamCalculatedValues, openTeamDeletePrompt, onEdit, canEdit }) => {
  const [propertiesMetaData] = teamCalculatedValues.filter(
    ({ team: teamId }) => teamId === team.id
  );

  return (
    <TeamItem
      team={team}
      teamCalculatedValues={propertiesMetaData}
      openTeamDeletePrompt={openTeamDeletePrompt}
      onEdit={onEdit}
      canEdit={canEdit}
    />
  );
};

// Sidebar component
const PropertiesSidebar: FunctionComponent<PropertiesSidebarLayoutModel> = ({
  teams,
  teamCalculatedValues,
  openTeamDeletePrompt,
  onEdit,
  canEdit
}) => {
  if (teams.length < 1) {
    return <></>;
  }
  return (
    <nav className={styles.sidebar} data-testid="properties-teams-sidebar">
      <h4 className={styles.sidebar__heading}>Teams</h4>

      <ul className={styles.sidebar__list}>
        {teamCalculatedValues.length &&
          teams.map((team) => (
            <TeamItemWrapper
              key={team.id}
              team={team}
              teamCalculatedValues={teamCalculatedValues}
              openTeamDeletePrompt={openTeamDeletePrompt}
              onEdit={onEdit}
              canEdit={canEdit}
            />
          ))}
      </ul>
    </nav>
  );
};

export default PropertiesSidebar;

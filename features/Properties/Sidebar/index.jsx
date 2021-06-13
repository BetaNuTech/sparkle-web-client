import PropTypes from 'prop-types';
import styles from './Sidebar.module.scss';
import { TeamItem } from './TeamItem';

export const Sidebar = ({ teams, teamCalculatedValues }) => (
  <nav className={styles.sidebar} data-testid="properties-teams-sidebar">
    <h4 className={styles.sidebar__heading}>Teams</h4>

    <ul className={styles.sidebar__list}>
      {teamCalculatedValues.length !== 0 &&
        teams.map((team) => (
          <TeamItem
            key={team.id}
            team={team}
            teamCalculatedValues={teamCalculatedValues[team.id - 1]}
          />
        ))}
    </ul>
  </nav>
);

Sidebar.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      properties: PropTypes.arrayOf(PropTypes.number).isRequired,
      propertyCount: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  teamCalculatedValues: PropTypes.arrayOf(
    PropTypes.shape({
      totalNumOfDeficientItems: PropTypes.number.isRequired,
      totalNumOfFollowUpActionsForDeficientItems: PropTypes.number.isRequired,
      totalNumOfRequiredActionsForDeficientItems: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
};

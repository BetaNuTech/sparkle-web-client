import PropTypes from 'prop-types';
import styles from './MobileProperties.module.scss';
import { TeamItem } from './TeamItem';
import { PropertyItem } from './PropertyItem';

export const MobileProperties = ({
  properties,
  teams,
  teamCalculatedValues
}) => (
  <ul className={styles.mobileProperties} data-testid="mobile-properties-list">
    <li className={styles.mobileProperties__item}>
      <header>teams</header>
      {teamCalculatedValues.length !== 0 &&
        teams.map((team) => (
          <TeamItem
            key={team.id}
            team={team}
            teamCalculatedValues={teamCalculatedValues[team.id - 1]}
          />
        ))}
    </li>

    <li className={styles.mobileProperties__item}>
      <header>properties</header>

      {properties.map((property) => (
        <PropertyItem key={property.id} property={property} />
      ))}
    </li>
  </ul>
);

MobileProperties.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundImage: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      addr1: PropTypes.string.isRequired,
      addr2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      lastInspectionDate: PropTypes.number.isRequired,
      lastInspectionScore: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
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

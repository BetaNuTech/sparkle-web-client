import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './TeamItem.module.scss';
import { TeamValues } from '../../../common/TeamValues';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';

export const TeamItem = ({ team, teamCalculatedValues }) => (
  <li className={styles.teamItem}>
    {/* Team Name */}
    <Link href="/teams">
      <a className={styles.teamItem__name}>{team.name}</a>
    </Link>

    <button aria-label="Open menu" className={styles.teamItem__menuButton}>
      <ActionsIcon />
    </button>

    {/* Metadata */}
    <TeamValues
      numOfDeficientItems={teamCalculatedValues.totalNumOfDeficientItems}
      numOfFollowUpActionsForDeficientItems={
        teamCalculatedValues.totalNumOfFollowUpActionsForDeficientItems
      }
      numOfRequiredActionsForDeficientItems={
        teamCalculatedValues.totalNumOfRequiredActionsForDeficientItems
      }
      isNarrowField
    />
  </li>
);

TeamItem.propTypes = {
  team: PropTypes.shape({
    name: PropTypes.string.isRequired,
    properties: PropTypes.arrayOf(PropTypes.number).isRequired,
    propertyCount: PropTypes.number.isRequired
  }).isRequired,
  teamCalculatedValues: PropTypes.shape({
    totalNumOfDeficientItems: PropTypes.number.isRequired,
    totalNumOfFollowUpActionsForDeficientItems: PropTypes.number.isRequired,
    totalNumOfRequiredActionsForDeficientItems: PropTypes.number.isRequired
  }).isRequired
};

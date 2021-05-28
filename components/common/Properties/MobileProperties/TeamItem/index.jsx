import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './TeamItem.module.scss';
import { TeamValues } from '../../../../shared/TeamValues';

export const TeamItem = ({ name }) => (
  <div className={styles.teamItem}>
    {/* Toggle Button */}
    <div className={styles.teamItem__toggle} data-action="toggle-reveal" />

    {/* Team Name */}
    <Link href="/lalala">
      <a className={styles.teamItem__name}>
        <strong>{name}</strong>
      </a>
    </Link>

    {/* Metadata */}
    <Link href="/lalala">
      <a className={styles.teamItem__metadata}>
        Deficient Items
        <TeamValues
          numOfDeficientItems={2}
          numOfFollowUpActionsForDeficientItems={2}
          numOfRequiredActionsForDeficientItems={4}
          isNarrowField={false}
        />
      </a>
    </Link>
  </div>
);

TeamItem.propTypes = {
  name: PropTypes.string.isRequired
};

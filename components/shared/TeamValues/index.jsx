import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './TeamValues.module.scss';

export const TeamValues = ({
  numOfDeficientItems,
  numOfRequiredActionsForDeficientItems,
  numOfFollowUpActionsForDeficientItems,
  isNarrowField
}) => (
  <Link href="/properties">
    <a
      className={
        isNarrowField
          ? clsx(styles.teamValues, styles['teamValues--narrow'])
          : styles.teamValues
      }
    >
      <ul>
        <li>{numOfDeficientItems}</li>
        <li>{numOfRequiredActionsForDeficientItems}</li>
        <li>{numOfFollowUpActionsForDeficientItems}</li>
      </ul>
    </a>
  </Link>
);

TeamValues.propTypes = {
  numOfDeficientItems: PropTypes.number.isRequired,
  numOfRequiredActionsForDeficientItems: PropTypes.number.isRequired,
  numOfFollowUpActionsForDeficientItems: PropTypes.number.isRequired,
  isNarrowField: PropTypes.bool.isRequired
};

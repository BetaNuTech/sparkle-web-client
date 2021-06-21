import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './TeamValues.module.scss';

export const TeamValues = ({
  numOfDeficientItems,
  numOfRequiredActionsForDeficientItems,
  numOfFollowUpActionsForDeficientItems,
  isNarrowField
}) => (
  <ul
    className={
      isNarrowField
        ? clsx(styles.teamValues, styles['teamValues--narrow'])
        : styles.teamValues
    }
  >
    <li data-testid="num-of-deficient-items">{numOfDeficientItems}</li>
    <li data-testid="num-of-required-actions">
      {numOfRequiredActionsForDeficientItems}
    </li>
    <li data-testid="num-of-follow-up-actions">
      {numOfFollowUpActionsForDeficientItems}
    </li>
  </ul>
);

TeamValues.propTypes = {
  numOfDeficientItems: PropTypes.number.isRequired,
  numOfRequiredActionsForDeficientItems: PropTypes.number.isRequired,
  numOfFollowUpActionsForDeficientItems: PropTypes.number.isRequired,
  isNarrowField: PropTypes.bool.isRequired
};

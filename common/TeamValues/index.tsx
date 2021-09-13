import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  numOfDeficientItems: number;
  numOfRequiredActionsForDeficientItems: number;
  numOfFollowUpActionsForDeficientItems: number;
  isNarrowField: boolean;
}

const TeamValues: FunctionComponent<Props> = ({
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

TeamValues.defaultProps = {
  numOfDeficientItems: 0,
  numOfRequiredActionsForDeficientItems: 0,
  numOfFollowUpActionsForDeficientItems: 0,
  isNarrowField: false
};

export default TeamValues;

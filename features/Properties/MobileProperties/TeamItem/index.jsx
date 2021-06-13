import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import styles from './TeamItem.module.scss';
import { TeamValues } from '../../../../common/TeamValues';
import { SwipeReveal } from '../SwipeReveal';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

export const TeamItem = ({ team, teamCalculatedValues }) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  return (
    <div ref={ref} className={styles.teamItem}>
      {/* Main Content */}
      <div
        className={
          isSwipeOpen
            ? clsx(styles.teamItem__content, styles['teamItem--swipeOpen'])
            : styles.teamItem__content
        }
      >
        {/* Toggle Button */}
        <Link href="/lalala">
          <a className={styles.teamItem__toggle}>
            <ChevronIcon />
          </a>
        </Link>

        {/* Team Name */}
        <Link href="/lalala">
          <a className={styles.teamItem__name}>
            <strong>{team.name}</strong>
          </a>
        </Link>

        {/* Metadata */}
        <div className={styles.teamItem__metadata}>
          Deficient Items
          <TeamValues
            numOfDeficientItems={teamCalculatedValues.totalNumOfDeficientItems}
            numOfFollowUpActionsForDeficientItems={
              teamCalculatedValues.totalNumOfFollowUpActionsForDeficientItems
            }
            numOfRequiredActionsForDeficientItems={
              teamCalculatedValues.totalNumOfRequiredActionsForDeficientItems
            }
            isNarrowField={false}
          />
        </div>
      </div>

      <SwipeReveal />
    </div>
  );
};

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
  })
};

TeamItem.defaultProps = {
  teamCalculatedValues: {
    totalNumOfDeficientItems: 0,
    totalNumOfFollowUpActionsForDeficientItems: 0,
    totalNumOfRequiredActionsForDeficientItems: 0
  }
};

import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import styles from './TeamItem.module.scss';
import { TeamValues } from '../../../common/TeamValues';
import { SwipeReveal } from '../SwipeReveal';
import useSwipeReveal from '../../../../hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

export const TeamItem = ({ name }) => {
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
            <strong>{name}</strong>
          </a>
        </Link>

        {/* Metadata */}
        <div className={styles.teamItem__metadata}>
          Deficient Items
          <TeamValues
            numOfDeficientItems={2}
            numOfFollowUpActionsForDeficientItems={2}
            numOfRequiredActionsForDeficientItems={4}
            isNarrowField={false}
          />
        </div>
      </div>

      <SwipeReveal />
    </div>
  );
};

TeamItem.propTypes = {
  name: PropTypes.string.isRequired
};

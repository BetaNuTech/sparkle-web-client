import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import styles from './PropertyItem.module.scss';
import { TeamValues } from '../../../../shared/TeamValues';
import { SwipeReveal } from '../SwipeReveal';
import useSwipeReveal from '../../../../../hooks/useSwipeReveal';
import ChevronIcon from '../../../../../public/icons/ios/chevron.svg';

export const PropertyItem = ({
  backgroundImage,
  name,
  addr1,
  mailingAddr2,
  lastInspectionEntries
}) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  return (
    <div ref={ref} className={styles.propertyItem}>
      {/* Main Content */}
      <div
        className={
          isSwipeOpen
            ? clsx(
                styles.propertyItem__content,
                styles['propertyItem--swipeOpen']
              )
            : styles.propertyItem__content
        }
      >
        {/* Toggle Button */}
        <a className={styles.propertyItem__toggle}>
          <ChevronIcon />
        </a>

        <Link href="/property">
          <a className={styles.propertyItem__wrapper}>
            {/* Profile Picture */}
            <aside
              className={styles.propertyItem__image}
              style={
                backgroundImage && {
                  backgroundImage: `url('${backgroundImage}')`
                }
              }
            />

            {/* Profile Description */}
            <div className={styles.propertyItem__description}>
              <h6 className={styles.propertyItem__name}>{name}</h6>
              <p className={styles.propertyItem__addr1}>{addr1}</p>
              <p className={styles.propertyItem__mailingAddr2}>
                {mailingAddr2}
              </p>
              {lastInspectionEntries ? (
                <p className={styles.propertyItem__lastInspectionEntries}>
                  {lastInspectionEntries}
                </p>
              ) : (
                <p
                  className={clsx(
                    styles.propertyItem__lastInspectionEntries,
                    styles['propertyItem__lastInspectionEntries--empty']
                  )}
                >
                  No Inspections
                </p>
              )}
            </div>
          </a>
        </Link>

        {/* Metadata */}
        <div className={styles.propertyItem__metadata}>
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

PropertyItem.propTypes = {
  backgroundImage: PropTypes.string,
  name: PropTypes.string.isRequired,
  addr1: PropTypes.string.isRequired,
  mailingAddr2: PropTypes.string.isRequired,
  lastInspectionEntries: PropTypes.string
};

PropertyItem.defaultProps = {
  backgroundImage: undefined,
  lastInspectionEntries: undefined
};

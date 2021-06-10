import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import styles from './PropertyItem.module.scss';
import { TeamValues } from '../../../../common/TeamValues';
import { SwipeReveal } from '../SwipeReveal';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

export const PropertyItem = ({ property }) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  const onDeleteProperty = () => {
    /**
     * On click of delete property action
     * This is handled in common DeleteConfirmModal component
     */
    const event = new CustomEvent('deleteConfirm', {
      type: 'property',
      detail: {
        elRef: ref,
        property
      }
    });
    document.dispatchEvent(event);
  };

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
                property.backgroundImage && {
                  backgroundImage: `url(${property.backgroundImage})`
                }
              }
            />

            {/* Profile Description */}
            <div className={styles.propertyItem__description}>
              <h6 className={styles.propertyItem__name}>{property.name}</h6>
              <p className={styles.propertyItem__addr1}>{property.addr1}</p>
              <p className={styles.propertyItem__mailingAddr2}>
                {property.addr2}
              </p>
              {property.lastInspectionEntries ? (
                <p className={styles.propertyItem__lastInspectionEntries}>
                  {new Date(1000 * property.lastInspectionEntries)}
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
            numOfDeficientItems={property.numOfDeficientItems}
            numOfFollowUpActionsForDeficientItems={
              property.numOfFollowUpActionsForDeficientItems
            }
            numOfRequiredActionsForDeficientItems={
              property.numOfRequiredActionsForDeficientItems
            }
            isNarrowField={false}
          />
        </div>
      </div>

      <SwipeReveal onDelete={onDeleteProperty} />
    </div>
  );
};

PropertyItem.propTypes = {
  property: PropTypes.shape({
    backgroundImage: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    addr1: PropTypes.string.isRequired,
    addr2: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    lastInspectionDate: PropTypes.number.isRequired,
    lastInspectionScore: PropTypes.number.isRequired
  }).isRequired
};

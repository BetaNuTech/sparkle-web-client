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
    <div ref={ref} className={styles.propertyItem} data-testid="property-item">
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
        <Link href={`/properties/${property.id}`}>
          <a className={styles.propertyItem__link}>
            {/* Toggle Button */}
            <span className={styles.propertyItem__toggle}>
              <ChevronIcon />
            </span>
            <div className={styles.propertyItem__wrapper}>
              {/* Profile Picture */}
              <aside
                className={styles.propertyItem__image}
                style={
                  property.photoURL && {
                    backgroundImage: `url(${property.photoURL})`
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
            </div>
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
          </a>
        </Link>
      </div>

      <SwipeReveal onDelete={onDeleteProperty} />
    </div>
  );
};

PropertyItem.propTypes = {
  property: PropTypes.shape({
    photoURL: PropTypes.string,
    name: PropTypes.string.isRequired,
    addr1: PropTypes.string,
    addr2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    lastInspectionDate: PropTypes.number,
    lastInspectionScore: PropTypes.number
  }).isRequired
};

import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import styles from './styles.module.scss';
import parentStyles from '../styles.module.scss';
import { TeamValues } from '../../../../common/TeamValues';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

export const PropertyItem = ({ property, onQueuePropertyDelete }) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  return (
    <div
      ref={ref}
      className={parentStyles.itemResult}
      data-testid="property-item"
    >
      {/* Main Content */}
      <div
        className={
          isSwipeOpen
            ? clsx(
                parentStyles.itemResult__content,
                parentStyles['itemResult--swipeOpen']
              )
            : parentStyles.itemResult__content
        }
      >
        <Link href={`/properties/${property.id}`}>
          <a className={parentStyles.itemResult__link}>
            {/* Toggle Button */}
            <span className={parentStyles.itemResult__toggle}>
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
            <div className={parentStyles.itemResult__metadata}>
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

            {/* For Testing */}
            <span className="-d-none" data-testid="property-score">
              {property.lastInspectionScore}
            </span>
            <span
              className="-d-none"
              data-testid="property-last-inspection-date"
            >
              {property.lastInspectionDate}
            </span>
          </a>
        </Link>
      </div>

      {/* Swipe Reveal Actions */}
      <div
        className={clsx(
          parentStyles.swipeReveal,
          isSwipeOpen && parentStyles.swipeReveal__reveal
        )}
      >
        <button className={parentStyles.swipeReveal__editButton}>Edit</button>
        <button
          className={parentStyles.swipeReveal__deleteButton}
          onClick={() => onQueuePropertyDelete(property)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

PropertyItem.defaultProps = {
  onQueuePropertyDelete: () => {} // TODO require property
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
  }).isRequired,
  onQueuePropertyDelete: PropTypes.func
};

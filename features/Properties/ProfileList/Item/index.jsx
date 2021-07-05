/* eslint-disable no-unused-vars */
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './Item.module.scss';
import { TeamValues } from '../../../../common/TeamValues';

export const Item = ({ property }) => (
  <li
    className={styles.item}
    data-testid="property-item"
    data-property={property.id}
  >
    <Link href={`/properties/${property.id}`}>
      <a className={styles.item__wrapper}>
        {/* Profile Picture */}
        <aside
          className={styles.item__image}
          style={
            property.photoURL && {
              backgroundImage: `url(${property.photoURL})`
            }
          }
        />

        {/* Profile Description */}
        <div className={styles.item__main}>
          <header>
            <h6 className={styles.item__heading} data-testid="property-name">
              {property.name}
            </h6>
            {/** Do not show city if not present */}
            {property.city && (
              <p
                className={styles.item__subHeading}
                data-testid="property-city"
              >
                {property.city}
              </p>
            )}
          </header>
          {/** Do not show state if not present */}
          {property.state && (
            <p
              className={styles.item__description}
              data-testid="property-state"
            >
              {property.state}
            </p>
          )}
        </div>
      </a>
    </Link>

    {/* Metadata And Edit Button */}
    <footer className={styles.item__footer}>
      <Link href="/edit">
        <a className={styles.item__link}>
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
        </a>
      </Link>

      <Link href="/edit">
        <a className={styles.item__editButton}>Edit</a>
      </Link>
    </footer>
  </li>
);

Item.propTypes = {
  property: PropTypes.shape({
    photoURL: PropTypes.string,
    name: PropTypes.string.isRequired,
    addr1: PropTypes.string.isRequired,
    addr2: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    lastInspectionDate: PropTypes.number.isRequired,
    lastInspectionScore: PropTypes.number.isRequired
  }).isRequired
};

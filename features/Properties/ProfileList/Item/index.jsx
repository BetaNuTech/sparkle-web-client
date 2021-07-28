/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import styles from './Item.module.scss';
import LinkFeature from '../../../../common/LinkFeature';
import { TeamValues } from '../../../../common/TeamValues';
import features from '../../../../config/features';
import getLastInspectionEntry from '../../utils/getLastInspectionEntry';

export const Item = ({ property }) => {
  const lastInspectionEntry = getLastInspectionEntry(property);
  return (
    <li
      className={styles.item}
      data-testid="property-item"
      data-property={property.id}
    >
      <LinkFeature
        href={`/properties/${property.id}`}
        className={styles.item__wrapper}
        featureEnabled={features.supportBetaPropertyProfile}
      >
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
            {property.addr1 && (
              <p
                className={styles.item__subHeading}
                data-testid="property-addr1"
              >
                {property.addr1}
              </p>
            )}
          </header>
          {(property.city || property.state) && (
            <p className={styles.item__description}>
              {/** Do not show city if not present */}
              {property.city && (
                <span data-testid="property-city">{`${property.city}, `}</span>
              )}
              {/** Do not show state if not present */}
              {property.state && (
                <span data-testid="property-state">{`${property.state} `}</span>
              )}
              {property.zip && (
                <span data-testid="property-zip">{property.zip}</span>
              )}
            </p>
          )}
          {lastInspectionEntry && (
            <p className={styles.item__description}>{lastInspectionEntry}</p>
          )}
        </div>
      </LinkFeature>

      {/* Metadata And Edit Button */}
      <footer className={styles.item__footer}>
        <LinkFeature
          href={`/properties/${property.id}/deficient-items`}
          className={styles.item__link}
          featureEnabled={features.supportBetaPropertyDeficient}
        >
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
        </LinkFeature>

        <LinkFeature
          href={`/properties/update/${property.id}`}
          className={styles.item__editButton}
          featureEnabled={features.supportBetaPropertyUpdate}
        >
          Edit
        </LinkFeature>
      </footer>
    </li>
  );
};

Item.propTypes = {
  property: PropTypes.shape({
    photoURL: PropTypes.string,
    name: PropTypes.string.isRequired,
    addr1: PropTypes.string.isRequired,
    addr2: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string,
    lastInspectionDate: PropTypes.number.isRequired,
    lastInspectionScore: PropTypes.number.isRequired
  }).isRequired
};

/* eslint-disable no-unused-vars */
import { FunctionComponent, useRef } from 'react';
import styles from './styles.module.scss';
import useVisibility from '../../../hooks/useVisibility';
import propertyModel from '../../../models/property';
import LinkFeature from '../../../LinkFeature';
import TeamValues from '../../../TeamValues';
import features from '../../../../config/features';
import getLastInspectionEntry from '../../../../features/Properties/utils/getLastInspectionEntry';

interface Props {
  property: propertyModel;
  forceVisible?: boolean;
}

const Item: FunctionComponent<Props> = ({ property, forceVisible }) => {
  const lastInspectionEntry = getLastInspectionEntry(property);
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);
  return (
    <li
      ref={placeholderRef}
      className={styles.item}
      data-testid="property-item"
      data-property={property.id}
    >
      {isVisible && (
        <>
          <LinkFeature
            href={`/properties/${property.id}`}
            className={styles.item__wrapper}
            featureEnabled={features.supportBetaPropertyProfile}
          >
            {/* Profile Picture */}
            <aside
              className={styles.item__image}
              style={
                property.photoURL
                  ? {
                      backgroundImage: `url(${property.photoURL})`
                    }
                  : {}
              }
            />

            {/* Profile Description */}
            <div className={styles.item__main}>
              <header>
                <h6
                  className={styles.item__heading}
                  data-testid="property-name"
                  title={property.name}
                >
                  {property.name}
                </h6>
                {property.addr1 && (
                  <p
                    className={styles.item__subHeading}
                    data-testid="property-addr1"
                    title={property.addr1}
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
                <p className={styles.item__description}>
                  {lastInspectionEntry}
                </p>
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
              <span className="-mr-sm">Deficient Items</span>
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
              href={
                features.supportBetaPropertyUpdate
                  ? `/properties/edit/${property.id}`
                  : `/properties/update/${property.id}`
              }
              className={styles.item__editButton}
              featureEnabled={features.supportBetaPropertyUpdate}
            >
              Edit
            </LinkFeature>
          </footer>
        </>
      )}
    </li>
  );
};

Item.defaultProps = {
  forceVisible: false
};

export default Item;

import clsx from 'clsx';
import { useState, useRef, FunctionComponent } from 'react';
import propertyModel from '../../../models/property';
import TeamValues from '../../../TeamValues';
import useSwipeReveal from '../../../hooks/useSwipeReveal';
import LinkFeature from '../../../LinkFeature';
import useVisibility from '../../../hooks/useVisibility';
import features from '../../../../config/features';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import getLastInspectionEntry from '../../../../features/Properties/utils/getLastInspectionEntry';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface MobileLayoutPropertyItemProps {
  property: propertyModel;
  onQueuePropertyDelete: (property: propertyModel) => void;
  forceVisible?: boolean;
  hasEditPropertyAccess: boolean;
}

const PropertyItem: FunctionComponent<MobileLayoutPropertyItemProps> = ({
  property,
  onQueuePropertyDelete,
  forceVisible,
  hasEditPropertyAccess
}) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  const placeholderRef = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

  const lastInspectionEntry = getLastInspectionEntry(property);

  return (
    <div className={styles.propertyItem__placeholder} ref={placeholderRef}>
      {/** Moved this out because we need ref for swipe reveal to work */}
      <div
        ref={ref}
        className={parentStyles.itemResult}
        data-testid="property-item"
      >
        {isVisible && (
          <>
            {/* Main Content */}
            <div
              className={
                isSwipeOpen && hasEditPropertyAccess
                  ? clsx(
                      parentStyles.itemResult__content,
                      parentStyles['itemResult--swipeOpen']
                    )
                  : parentStyles.itemResult__content
              }
            >
              <LinkFeature
                href={`/properties/${property.id}`}
                featureEnabled={features.supportPropertyProfile}
                className={parentStyles.itemResult__link}
              >
                {/* Toggle Button */}
                <span className={parentStyles.itemResult__toggle}>
                  <ChevronIcon />
                </span>
                <div className={styles.propertyItem__wrapper}>
                  {/* Profile Picture */}
                  <aside
                    className={styles.propertyItem__image}
                    style={
                      property.photoURL
                        ? { backgroundImage: `url(${property.photoURL})` }
                        : {}
                    }
                  />

                  {/* Profile Description */}
                  <div className={styles.propertyItem__description}>
                    <h6
                      className={styles.propertyItem__name}
                      data-testid="property-name"
                    >
                      {property.name}
                    </h6>
                    {/* Do not show addr1 if not present */}
                    {property.addr1 && (
                      <div
                        className={styles.propertyItem__addr1}
                        data-testid="property-addr1"
                      >
                        {property.addr1}
                      </div>
                    )}
                    {(property.city || property.state) && (
                      <div className={styles.propertyItem__mailingAddr2}>
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
                      </div>
                    )}
                    {lastInspectionEntry && (
                      <p
                        className={styles.propertyItem__lastInspectionEntries}
                        data-testid="property-last-inspection-entry"
                      >
                        {lastInspectionEntry}
                      </p>
                    )}
                  </div>
                </div>
              </LinkFeature>

              {/* Metadata */}
              <LinkFeature
                href={`/properties/${property.id}/deficient-items`}
                className={parentStyles.itemResult__metadata}
                featureEnabled={features.supportPropertyDeficient}
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
            </div>

            {/* Swipe Reveal Actions */}
            {hasEditPropertyAccess && (
              <div
                className={clsx(
                  parentStyles.swipeReveal,
                  isSwipeOpen && parentStyles.swipeReveal__reveal
                )}
              >
                <LinkFeature
                  href={
                    features.supportPropertyUpdate
                      ? `/properties/edit/${property.id}`
                      : `/properties/update/${property.id}`
                  }
                  className={parentStyles.swipeReveal__editButton}
                  featureEnabled={features.supportPropertyUpdate}
                >
                  Edit
                </LinkFeature>
                <button
                  className={parentStyles.swipeReveal__deleteButton}
                  onClick={() => onQueuePropertyDelete(property)}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

PropertyItem.defaultProps = {
  forceVisible: false
};

export default PropertyItem;

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import propertyModel from '../../../common/models/property';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import styles from './styles.module.scss';

interface Props {
  canUserAccessJob: boolean;
  property: propertyModel;
  isMobile?: boolean;
  isYardiConfigured: boolean;
}

const getMobileExtra: FunctionComponent<Props> = ({
  canUserAccessJob,
  property,
  isMobile,
  isYardiConfigured
}) => {
  const jobLink = `/properties/${property.id}/jobs`;
  const residentsLink = `/properties/${property.id}/yardi-residents`;
  const workOrdersLink = `/properties/${property.id}/yardi-work-orders`;

  if (isMobile) {
    return (
      <>
        {
          // eslint-disable-next-line no-nested-ternary
          (isYardiConfigured || canUserAccessJob) && (
            <ul className={clsx(styles.propertyProfile__header__ctaItems)}>
              {isYardiConfigured && (
                <>
                  <li data-testid="property-profile-yardi-button">
                    <LinkFeature
                      href={residentsLink}
                      featureEnabled={features.supportBetaPropertyYardiResident}
                    >
                      Residents <ChevronIcon />
                    </LinkFeature>
                  </li>
                  <li>
                    <LinkFeature
                      href={workOrdersLink}
                      featureEnabled={
                        features.supportBetaPropertyYardiWorkOrder
                      }
                    >
                      Open WOs <ChevronIcon />
                    </LinkFeature>
                  </li>
                </>
              )}
              {canUserAccessJob && (
                <li>
                  <Link href={jobLink}>
                    <a data-testid="property-profile-view-jobs">
                      Jobs <ChevronIcon />
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          )
        }

        <LinkFeature
          href={`/properties/${property.id}/deficient-items`}
          featureEnabled={features.supportBetaPropertyDeficient}
        >
          <ol className={clsx(styles.propertyProfile__header__deficientItems)}>
            <li data-testid="property-profile-deficient-item">
              <span
                className={clsx(
                  styles.propertyProfile__header__label,
                  '-bgc-black'
                )}
              >
                {property.id && !property.numOfDeficientItems
                  ? 0
                  : property.numOfDeficientItems}
              </span>
              {` Deficient Item${property.numOfDeficientItems > 1 ? 's' : ''}`}
            </li>
            <li data-testid="property-profile-deficient-item-actions">
              <span
                className={clsx(
                  styles.propertyProfile__header__label,
                  '-bgc-alert-secondary'
                )}
              >
                {property.id && !property.numOfRequiredActionsForDeficientItems
                  ? 0
                  : property.numOfRequiredActionsForDeficientItems}
              </span>
              {` Action${
                property.numOfRequiredActionsForDeficientItems > 1 ? 's' : ''
              } Required`}
            </li>
            <li data-testid="property-profile-deficient-item-followups">
              <span
                className={clsx(
                  styles.propertyProfile__header__label,
                  '-bgc-quaternary'
                )}
              >
                {property.id && !property.numOfFollowUpActionsForDeficientItems
                  ? 0
                  : property.numOfFollowUpActionsForDeficientItems}
              </span>
              {` Follow Up${
                property.numOfFollowUpActionsForDeficientItems > 1 ? 's' : ''
              }`}
            </li>
          </ol>
        </LinkFeature>
      </>
    );
  }
  return null;
};

const Header: FunctionComponent<Props> = ({
  canUserAccessJob,
  property,
  isMobile,
  isYardiConfigured
}) => {
  if (property) {
    return (
      <header
        className={clsx(styles.propertyProfile__header)}
        data-testid={
          isMobile
            ? 'property-profile-header-mobile'
            : 'property-profile-header'
        }
      >
        <div className={clsx(styles.propertyProfile__header__banner)}>
          <div
            className={clsx(styles.propertyProfile__header__banner__wrapper)}
          >
            {
              // If we do not have property URL
              // then we show property name instead
              property.photoURL ? (
                <img
                  className={clsx(
                    styles.propertyProfile__header__banner__image
                  )}
                  alt="Property"
                  src={property.photoURL}
                />
              ) : (
                <h2
                  className={clsx(
                    styles.propertyProfile__header__banner__headline
                  )}
                  data-testid="property-profile-name"
                >
                  {property.name}
                </h2>
              )
            }
          </div>
        </div>
        {getMobileExtra({
          canUserAccessJob,
          property,
          isMobile,
          isYardiConfigured
        })}
      </header>
    );
  }
  return null;
};

export default Header;

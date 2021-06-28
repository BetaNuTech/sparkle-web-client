import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import styles from './styles.module.scss';

interface Props {
  property: propertyModel;
  isMobile?: boolean;
  isYardiConfigured: boolean;
}

const getMobileExtra: FunctionComponent<Props> = ({
  property,
  isMobile,
  isYardiConfigured
}) => {
  if (isMobile) {
    return (
      <>
        {isYardiConfigured ? (
          <ul
            className={clsx(styles.propertyProfile__header__ctaItems)}
            data-testid="property-profile-yardi-button"
          >
            <li>
              <Link href="/properties">
                <a>
                  Residents <ChevronIcon />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/properties">
                <a>
                  Open WOs <ChevronIcon />
                </a>
              </Link>
            </li>
          </ul>
        ) : null}

        <ol className={clsx(styles.propertyProfile__header__deficientItems)}>
          <li data-testid="property-profile-deficient-item">
            <span
              className={clsx(
                styles.propertyProfile__header__label,
                '-bgc-black'
              )}
            >
              {property.numOfDeficientItems}
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
              {property.numOfRequiredActionsForDeficientItems}
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
              {property.numOfFollowUpActionsForDeficientItems}
            </span>
            {` Follow Up${
              property.numOfFollowUpActionsForDeficientItems > 1 ? 's' : ''
            }`}
          </li>
        </ol>
        <footer
          className={clsx(styles.propertyProfile__header__subMenu)}
          data-testid="property-profile-mobile-footer"
        >
          Sorted by Creation Date
        </footer>
      </>
    );
  }
  return null;
};

const Header: FunctionComponent<Props> = ({
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
        {getMobileExtra({ property, isMobile, isYardiConfigured })}
      </header>
    );
  }
  return null;
};

export default Header;

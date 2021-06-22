import { FunctionComponent } from 'react';
import clsx from 'clsx';
import propertyModel from '../../../common/models/property';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import styles from './styles.module.scss';

interface Props {
  property: propertyModel;
  isMobile?: boolean;
}

const getMobileExtra: FunctionComponent<Props> = ({ property, isMobile }) => {
  if (isMobile) {
    return (
      <>
        {
          // TODO: Add logic to check code and yardiAuthorizer
          property.code ? (
            <ul className={clsx(styles.propertyProfile__header__ctaItems)} data-testid="property-profile-yardi-button">
              <li>
                <a href="/">
                  Residents <ChevronIcon />
                </a>
              </li>
              <li>
                <a href="/">
                  Open WOs <ChevronIcon />
                </a>
              </li>
            </ul>
          ) : null
        }

        <ol className={clsx(styles.propertyProfile__header__deficientItems)}>
          <li data-testid="property-profile-deficient-item">
            <span
              className={clsx(
                styles.propertyProfile__header__label,
                styles['-bgc-black']
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
                styles['-bgc-alert-secondary']
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
                styles['-bgc-quaternary']
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

const Header: FunctionComponent<Props> = ({ property, isMobile }) => {
  if (property) {
    return (
      <header
        className={clsx(styles.propertyProfile__header)}
        data-testid="property-profile-header"
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
        {getMobileExtra({ property, isMobile })}
      </header>
    );
  }
  return null;
};

export default Header;

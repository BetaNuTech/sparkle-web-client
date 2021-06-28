import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface Props {
  property: propertyModel;
  inspections: Array<inspectionModel>;
  isYardiConfigured: boolean;
}

const YardiButtons: FunctionComponent<{
  isYardiConfigured: boolean;
}> = ({ isYardiConfigured }) =>
  isYardiConfigured ? (
    <ul
      className={clsx(styles.propertyProfile__overview__links, '-p-none')}
      data-testid="property-profile-yardi-button"
    >
      <li>
        <Link href="/properties">
          <a>Residents</a>
        </Link>
      </li>
      <li>
        <Link href="/properties">
          <a>Open WOs</a>
        </Link>
      </li>
    </ul>
  ) : null;

const DeficiencienItemsLink: FunctionComponent<{ property: propertyModel }> = ({
  property
}) => (
  <ul
    className={clsx(
      styles['spk-deficient-items-link__metadata'],
      '-m-none',
      '-p-none'
    )}
  >
    <li data-testid="property-profile-deficient-item">
      <span className={clsx(styles['spk-deficient-items-link__label'])}>
        {property.numOfDeficientItems}
      </span>
      {`Deficient Item${property.numOfDeficientItems > 1 ? 's' : ''}`}
    </li>
    <li data-testid="property-profile-deficient-item-actions">
      <span
        className={clsx(
          styles['spk-deficient-items-link__label'],
          '-bgc-alert-secondary'
        )}
      >
        {property.numOfRequiredActionsForDeficientItems}
      </span>
      <div>
        {`Action${
          property.numOfRequiredActionsForDeficientItems > 1 ? 's' : ''
        } Required`}
        {property.numOfOverdueDeficientItems ? (
          <small className={styles['spk-deficient-items-link__labelSub']}>
            {property.numOfOverdueDeficientItems} Overdue
          </small>
        ) : null}
      </div>
    </li>
    <li data-testid="property-profile-deficient-item-followups">
      <span
        className={clsx(
          styles['spk-deficient-items-link__label'],
          '-bgc-quaternary'
        )}
      >
        {property.numOfFollowUpActionsForDeficientItems}
      </span>
      {`Follow Up${
        property.numOfFollowUpActionsForDeficientItems > 1 ? 's' : ''
      }`}
    </li>
  </ul>
);

const FilterView: FunctionComponent<{ inspections: Array<inspectionModel> }> =
  ({ inspections }) =>
    inspections.length > 0 ? (
      <label
        htmlFor="inspection-completed-filter"
        className={styles.propertyProfile__overview__control}
      >
        Filter by:
        <select id="inspection-completed-filter" name="inspection-completed">
          <option value="">None</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
          <option value="deficienciesExist">Deficiencies Exist</option>
        </select>
      </label>
    ) : null;

const Overview: FunctionComponent<Props> = ({
  property,
  inspections,
  isYardiConfigured
}) => {
  // Set logoUrl to logoURL property
  let logoUrl = property.logoURL ? property.logoURL : '';

  // If it was false above then set to bannerPhotoURL
  logoUrl = !logoUrl ? property.bannerPhotoURL : logoUrl;
  return (
    <div
      className={styles.propertyProfile__overview}
      data-testid="property-profile-overview"
    >
      <div className={styles.propertyProfile__overview__header}>
        {logoUrl ? (
          <img
            className={styles.propertyProfile__overview__logo}
            src={logoUrl}
            alt={`${property.name} Logo`}
            data-testid="property-profile-overview-logo"
          />
        ) : (
          <h1
            className={styles.propertyProfile__overview__heading}
            data-testid="property-profile-overview-heading"
          >
            {property.name}
          </h1>
        )}
        <Link href="/properties">
          <a className={clsx('button', styles.button, styles.primary)}>
            Add Inspection{' '}
            <span className={styles.iconAddButton}>
              <AddIcon />
            </span>
          </a>
        </Link>
      </div>
      <footer className={styles.propertyProfile__overview__footer}>
        <YardiButtons isYardiConfigured={isYardiConfigured} />
        <Link href="/properties">
          <a
            className={clsx(
              styles['spk-deficient-items-link'],
              styles['-inline'],
              styles['-no-container']
            )}
          >
            <DeficiencienItemsLink property={property} />
          </a>
        </Link>
        <FilterView inspections={inspections} />
      </footer>
    </div>
  );
};
export default Overview;

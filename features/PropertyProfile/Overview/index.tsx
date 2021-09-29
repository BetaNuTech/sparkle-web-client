import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface Props {
  canUserAccessJob: boolean;
  property: propertyModel;
  inspections: Array<inspectionModel>;
  isYardiConfigured: boolean;
  setInspectionFilter?(string): void;
}

const YardiButtons: FunctionComponent<{
  propertyId: string;
  isYardiConfigured: boolean;
}> = ({ propertyId, isYardiConfigured }) =>
  isYardiConfigured ? (
    <ul
      className={clsx(styles.propertyProfile__overview__links, '-p-none')}
      data-testid="property-profile-yardi-button"
    >
      <li>
        <LinkFeature
          href={`/properties/${propertyId}/yardi-residents`}
          featureEnabled={features.supportBetaPropertyYardiResident}
        >
          Residents
        </LinkFeature>
      </li>
      <li>
        <LinkFeature
          href={`/properties/${propertyId}/yardi-work-orders`}
          featureEnabled={features.supportBetaPropertyYardiWorkOrder}
        >
          Open WOs
        </LinkFeature>
      </li>
    </ul>
  ) : null;

const DeficiencienItemsLink: FunctionComponent<{ property: propertyModel }> = ({
  property
}) => (
  <ul
    className={clsx(
      styles.propertyProfile__overview__deficient__metadata,
      '-m-none',
      '-p-none'
    )}
  >
    <li data-testid="property-profile-deficient-item">
      <span
        className={clsx(styles.propertyProfile__overview__deficient__label)}
      >
        {property.id && !property.numOfDeficientItems
          ? 0
          : property.numOfDeficientItems}
      </span>
      {`Deficient Item${property.numOfDeficientItems > 1 ? 's' : ''}`}
    </li>
    <li data-testid="property-profile-deficient-item-actions">
      <span
        className={clsx(
          styles.propertyProfile__overview__deficient__label,
          '-bgc-alert-secondary'
        )}
      >
        {property.id && !property.numOfRequiredActionsForDeficientItems
          ? 0
          : property.numOfRequiredActionsForDeficientItems}
      </span>
      <div>
        {`Action${
          property.numOfRequiredActionsForDeficientItems > 1 ? 's' : ''
        } Required`}
        {property.numOfOverdueDeficientItems ? (
          <small
            className={styles.propertyProfile__overview__deficient__labelSub}
          >
            {property.numOfOverdueDeficientItems} Overdue
          </small>
        ) : null}
      </div>
    </li>
    <li data-testid="property-profile-deficient-item-followups">
      <span
        className={clsx(
          styles.propertyProfile__overview__deficient__label,
          '-bgc-quaternary'
        )}
      >
        {property.id && !property.numOfFollowUpActionsForDeficientItems
          ? 0
          : property.numOfFollowUpActionsForDeficientItems}
      </span>
      {`Follow Up${
        property.numOfFollowUpActionsForDeficientItems > 1 ? 's' : ''
      }`}
    </li>
  </ul>
);

const FilterView: FunctionComponent<{
  inspections: Array<inspectionModel>;
  setInspectionFilter(string): void;
}> = ({ inspections, setInspectionFilter }) =>
  inspections.length > 0 ? (
    <label
      htmlFor="inspection-filter"
      className={styles.propertyProfile__overview__control}
    >
      Filter by:
      <select
        id="inspection-filter"
        name="inspection-filter"
        onChange={(ev) => setInspectionFilter(ev.target.value)}
        data-testid="inspections-filter"
      >
        <option value="">None</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
        <option value="deficienciesExist">Deficiencies Exist</option>
      </select>
    </label>
  ) : null;

const Overview: FunctionComponent<Props> = ({
  canUserAccessJob,
  property,
  inspections,
  isYardiConfigured,
  setInspectionFilter
}) => {
  // Set logoUrl to logoURL property
  let logoUrl = property.logoURL ? property.logoURL : '';

  // If it was false above then set to bannerPhotoURL
  logoUrl = !logoUrl ? property.bannerPhotoURL : logoUrl;

  const jobLink = `/properties/${property.id}/jobs`;

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
        <div>
          {canUserAccessJob ? (
            <Link href={jobLink}>
              <a
                className={clsx(styles.propertyProfile__overview__linkButton)}
                data-testid="property-profile-view-jobs"
              >
                View Jobs
              </a>
            </Link>
          ) : null}
          <LinkFeature
            href={`/properties/${property.id}/create-inspection`}
            className={clsx('button', styles.button, styles.primary)}
            featureEnabled={features.supportBetaPropertyInspectionCreate}
          >
            Add Inspection{' '}
            <span className={styles.propertyProfile__overview__iconButton}>
              <AddIcon />
            </span>
          </LinkFeature>
        </div>
      </div>
      <footer className={styles.propertyProfile__overview__footer}>
        <YardiButtons
          isYardiConfigured={isYardiConfigured}
          propertyId={property.id}
        />
        <LinkFeature
          href={`/properties/${property.id}/deficient-items`}
          className={clsx(
            styles.propertyProfile__overview__deficient__link,
            styles['-no-container']
          )}
          featureEnabled={features.supportBetaPropertyDeficient}
        >
          <DeficiencienItemsLink property={property} />
        </LinkFeature>
        <FilterView
          inspections={inspections}
          setInspectionFilter={setInspectionFilter}
        />
      </footer>
    </div>
  );
};
export default Overview;

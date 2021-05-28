import clsx from 'clsx';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './PropertyItem.module.scss';
import { TeamValues } from '../../../../shared/TeamValues';

export const PropertyItem = ({
  backgroundImage,
  name,
  addr1,
  mailingAddr2,
  lastInspectionEntries
}) => (
  <div className={styles.propertyItem}>
    {/* Toggle Button */}
    <div className={styles.propertyItem__toggle} data-action="toggle-reveal" />

    <Link href="/property">
      <a className={styles.propertyItem__wrapper}>
        {/* Profile Picture */}
        <aside
          className={styles.propertyItem__image}
          style={
            backgroundImage && { backgroundImage: `url('${backgroundImage}')` }
          }
        />

        {/* Profile Description */}
        <div className={styles.propertyItem__description}>
          <h6 className={styles.propertyItem__name}>{name}</h6>
          <p className={styles.propertyItem__addr1}>{addr1}</p>
          <p className={styles.propertyItem__mailingAddr2}>{mailingAddr2}</p>
          {lastInspectionEntries ? (
            <p className={styles.propertyItem__lastInspectionEntries}>
              {lastInspectionEntries}
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
      </a>
    </Link>

    {/* Metadata */}
    <Link href="/lalala">
      <a className={styles.propertyItem__metadata}>
        Deficient Items
        <TeamValues
          numOfDeficientItems={2}
          numOfFollowUpActionsForDeficientItems={2}
          numOfRequiredActionsForDeficientItems={4}
          isNarrowField={false}
        />
      </a>
    </Link>
  </div>
);

PropertyItem.propTypes = {
  backgroundImage: PropTypes.string,
  name: PropTypes.string.isRequired,
  addr1: PropTypes.string.isRequired,
  mailingAddr2: PropTypes.string.isRequired,
  lastInspectionEntries: PropTypes.string
};

PropertyItem.defaultProps = {
  backgroundImage: undefined,
  lastInspectionEntries: undefined
};

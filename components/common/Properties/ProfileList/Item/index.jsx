import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './Item.module.scss';
import { TeamValues } from '../../../../shared/TeamValues';

export const Item = ({ backgroundImage, name, address1, address2 }) => (
  <li className={styles.item}>
    <Link href="/properties">
      <a className={styles.item__wrapper}>
        {/* Profile Picture */}
        <aside
          className={styles.item__image}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />

        {/* Profile Description */}
        <div className={styles.item__main}>
          <header>
            <h6 className={styles.item__heading}>{name}</h6>
            <p className={styles.item__subHeading}>{address1}</p>
          </header>
          <p className={styles.item__description}>{address2}</p>
        </div>
      </a>
    </Link>

    {/* Metadata And Edit Button */}
    <footer className={styles.item__footer}>
      <Link href="/edit">
        <a className={styles.item__link}>
          Deficient Items
          <TeamValues
            numOfDeficientItems={2}
            numOfFollowUpActionsForDeficientItems={2}
            numOfRequiredActionsForDeficientItems={4}
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
  backgroundImage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address1: PropTypes.string.isRequired,
  address2: PropTypes.string.isRequired
};

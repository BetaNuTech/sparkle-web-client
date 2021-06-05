import PropTypes from 'prop-types';
import styles from './MobileProperties.module.scss';
import { TeamItem } from './TeamItem';
import { PropertyItem } from './PropertyItem';

export const MobileProperties = ({ properties }) => (
  <ul className={styles.mobileProperties}>
    <li className={styles.mobileProperties__item}>
      <header>teams</header>
      <TeamItem name="Team one" />
      <TeamItem name="Team two" />
    </li>

    <li className={styles.mobileProperties__item}>
      <header>properties</header>

      {properties.map((property) => (
        <PropertyItem key={property.id} property={property} />
      ))}
    </li>
  </ul>
);

MobileProperties.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundImage: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      addr1: PropTypes.string.isRequired,
      addr2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      lastInspectionDate: PropTypes.number.isRequired,
      lastInspectionScore: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
};

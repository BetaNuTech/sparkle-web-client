import PropTypes from 'prop-types';
import styles from './ProfileList.module.scss';
import { Item } from './Item';

export const ProfileList = ({ properties }) => (
  <ul className={styles.profileList} data-testid="properties-list">
    {properties.map((property) => (
      <Item key={property.id} property={property} />
    ))}
  </ul>
);

ProfileList.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      photoURL: PropTypes.string,
      name: PropTypes.string.isRequired,
      addr1: PropTypes.string.isRequired,
      addr2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string,
      lastInspectionDate: PropTypes.number.isRequired,
      lastInspectionScore: PropTypes.number.isRequired
    }).isRequired
  ).isRequired
};

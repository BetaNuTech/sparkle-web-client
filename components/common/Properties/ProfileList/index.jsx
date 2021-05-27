/* eslint-disable max-len */
import PropTypes from 'prop-types';
import styles from './ProfileList.module.scss';
import { Item } from './Item';

export const ProfileList = ({ isAscendingSort }) => {
  // eslint-disable-next-line no-console
  console.log(isAscendingSort);

  return (
    <ul className={styles.profileList}>
      <Item
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2Fea35bb17a8b841e60c1d.jpeg?alt=media&token=2f85465d-3593-4c39-93ae-4165a2a1851e"
        name="1400 Chestnut"
        address1="1221 New Meister Lane"
        address2="Pflugerville, TX 78660"
      />
      <Item
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2F3e1c1a56d1bd381af398.jpeg?alt=media&token=5d69f6db-f240-4db9-9e52-843c66ee1e05"
        name="Emerson"
        address1="1221 New Meister Lane"
        address2="Pflugerville, TX 78660"
      />
      <Item
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2FdvSsHLv8cxAvIMKv9Gk0.jpeg?alt=media&token=f226942e-bc2e-476f-89dd-d2eee28cd2e4"
        name="Walnut Ridge"
        address1="1221 New Meister Lane"
        address2="Pflugerville, TX 78660"
      />
      <Item
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2F3e1c1a56d1bd381af398.jpeg?alt=media&token=5d69f6db-f240-4db9-9e52-843c66ee1e05"
        name="Emerson"
        address1="1221 New Meister Lane"
        address2="Pflugerville, TX 78660"
      />
      <Item
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2FdvSsHLv8cxAvIMKv9Gk0.jpeg?alt=media&token=f226942e-bc2e-476f-89dd-d2eee28cd2e4"
        name="Walnut Ridge"
        address1="1221 New Meister Lane"
        address2="Pflugerville, TX 78660"
      />
    </ul>
  );
};

ProfileList.propTypes = {
  isAscendingSort: PropTypes.bool.isRequired
};

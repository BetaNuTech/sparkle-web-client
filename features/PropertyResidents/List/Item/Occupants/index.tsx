import { FunctionComponent } from 'react';
import OccupantModel from '../../../../../common/models/yardi/occupant';
import { phoneNumber } from '../../../../../common/utils/humanize';
import Info from '../Info';

import styles from '../styles.module.scss';

interface Props {
  occupant: OccupantModel;
}

const OccupantItem: FunctionComponent<Props> = ({ occupant }) => {
  const hasName = Boolean(
    occupant.firstName || occupant.middleName || occupant.lastName
  );

  return (
    <>
      {hasName && (
        <div className={styles.info}>
          <p className={styles.info__label}>Name:</p>
          {occupant.firstName && (
            <span className={styles.info__value}>{occupant.firstName}</span>
          )}
          {occupant.middleName && (
            <span className={styles.info__value}>{occupant.middleName}</span>
          )}
          {occupant.lastName && (
            <span className={styles.info__value}>{occupant.lastName}</span>
          )}
        </div>
      )}

      {occupant.relationship && (
        <Info label="Relationship" value={occupant.relationship} />
      )}

      {occupant.email && <Info label="Email" value={occupant.email} />}
      {occupant.officeNumber && (
        <Info
          label="Office Number"
          value={phoneNumber(occupant.officeNumber)}
        />
      )}
      {occupant.homeNumber && (
        <Info label="Home Number" value={phoneNumber(occupant.homeNumber)} />
      )}
      {occupant.mobileNumber && (
        <Info
          label="Mobile Number"
          value={phoneNumber(occupant.mobileNumber)}
        />
      )}
    </>
  );
};

export default OccupantItem;

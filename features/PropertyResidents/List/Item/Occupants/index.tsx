import { FunctionComponent } from 'react';
import OccupantModel from '../../../../../common/models/yardi/occupant';
import { phoneNumber } from '../../../../../common/utils/humanize';
import Info, { InfoLabel, InfoValue } from '../../../../../common/Yardi/Info';

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
        <div className="-d-flex">
          <InfoLabel label="Name" />
          {occupant.firstName && <InfoValue value={occupant.firstName} />}
          {occupant.middleName && <InfoValue value={occupant.middleName} />}
          {occupant.lastName && <InfoValue value={occupant.lastName} />}
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

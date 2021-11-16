import { FunctionComponent } from 'react';
import residentModel from '../../common/models/yardi/resident';
import occupantModel from '../../common/models/yardi/occupant';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  residents: residentModel[];
  occupants: occupantModel[];
}

const PropertyResidents: FunctionComponent<Props> = ({
  residents,
  occupants
}) => (
  <>
    <h5>Residents:</h5>
    <ul>
      {residents.map((resident) => (
        <li key={resident.id}>{resident.id}</li>
      ))}
    </ul>
    <h5>Occupants:</h5>
    <ul>
      {occupants.map((occupant) => (
        <li key={occupant.id}>{occupant.id}</li>
      ))}
    </ul>
  </>
);

export default PropertyResidents;

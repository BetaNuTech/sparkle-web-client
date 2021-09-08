import { FunctionComponent } from 'react';
import propertyModel from '../../common/models/property';
import inspectionModel from '../../common/models/inspection';
import userModel from '../../common/models/user';

interface Props {
  user: userModel;
  inspection: inspectionModel;
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
}

const PropertyUpdateInspection: FunctionComponent<Props> = () => (
  <p>Update Inspection</p>
);

export default PropertyUpdateInspection;

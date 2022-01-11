import { FunctionComponent } from 'react';
import propertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';

interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: DeficientItemModel;
}

const DeficientItemEdit: FunctionComponent<Props> = ({
  user,
  property,
  deficientItem
}) => <div>Deficient Item Form Page</div>;

export default DeficientItemEdit;

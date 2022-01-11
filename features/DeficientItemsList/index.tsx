import { FunctionComponent } from 'react';
import propertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';

interface Props {
  user: userModel;
  property: propertyModel;
  deficientItemsList: DeficientItemModel[];
}

const DeficientItemsList: FunctionComponent<Props> = ({
  user,
  property,
  deficientItemsList
}) => <div>Deficient Item Form Page</div>;

export default DeficientItemsList;

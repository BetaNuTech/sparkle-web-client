import { FunctionComponent } from 'react';
import PropertyModel from '../../common/models/property';
import TeamModel from '../../common/models/team';
import UserModel from '../../common/models/user';

interface Props {
  user: UserModel;
  target: UserModel;
  properties: PropertyModel[];
  teams: TeamModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}
const UserEdit: FunctionComponent<Props> = ({ target }) => (
  <div>
    {target.id === 'new' ? 'Add' : 'Edit'} User {target.firstName}{' '}
    {target.lastName}
  </div>
);

export default UserEdit;

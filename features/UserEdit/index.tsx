import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import PropertyModel from '../../common/models/property';
import TeamModel from '../../common/models/team';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';

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

const UserEdit: FunctionComponent<Props> = ({
  target,
  isOnline,
  isStaging
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isCreatingUser = target.id === 'new';
  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isCreatingUser={isCreatingUser}
        user={target}
      />
      <div>
        {isCreatingUser ? 'Add' : 'Edit'} User {target.firstName}{' '}
        {target.lastName}
      </div>
    </>
  );
};

export default UserEdit;

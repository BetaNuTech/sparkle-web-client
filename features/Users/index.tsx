import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';

interface Props {
  user: UserModel;
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const Users: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        toggleNavOpen={toggleNavOpen}
      />
      <div>
        <h1>Users List</h1>
      </div>
    </>
  );
};

export default Users;

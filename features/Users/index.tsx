import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import UsersGroups from './Groups';
import Header from './Header';
import useUsersGroup from './hooks/useUsersGroup';

interface Props {
  user: UserModel;
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  list: UserModel[];
}

const Users: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  list,
  forceVisible
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const { userGroups, groups } = useUsersGroup(list);

  const scrollElementRef = useRef();
  usePreserveScrollPosition('UsersScroll', scrollElementRef, isMobile);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        toggleNavOpen={toggleNavOpen}
      />
      <UsersGroups
        userGroups={userGroups}
        groups={groups}
        scrollElementRef={scrollElementRef}
        forceVisible={forceVisible}
      />
    </>
  );
};

export default Users;

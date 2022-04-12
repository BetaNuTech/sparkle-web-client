import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import UsersGroups from './Groups';
import Header from './Header';
import useUsersGroup from './hooks/useUsersGroup';
import useUsersSearch from './hooks/useUsersSearch';

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

  const { filteredUsers, onClearSearch, onSearchKeyDown, searchValue } =
    useUsersSearch(list);

  const { userGroups, groups } = useUsersGroup(filteredUsers);

  const scrollElementRef = useRef();
  usePreserveScrollPosition('UsersScroll', scrollElementRef, isMobile);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        toggleNavOpen={toggleNavOpen}
        onSearchKeyDown={onSearchKeyDown}
        searchValue={searchValue}
        onClearSearch={onClearSearch}
      />
      <UsersGroups
        userGroups={userGroups}
        groups={groups}
        scrollElementRef={scrollElementRef}
        forceVisible={forceVisible}
        isMobile={isMobile}
        onSearchKeyDown={onSearchKeyDown}
        searchValue={searchValue}
        onClearSearch={onClearSearch}
      />
    </>
  );
};

export default Users;

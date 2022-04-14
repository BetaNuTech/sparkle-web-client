import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import UsersGroups from './Groups';
import Header from './Header';
import useSorting from './hooks/useSorting';
import useUsersGroup from './hooks/useUsersGroup';
import useUsersSearch from './hooks/useUsersSearch';

interface Props {
  user: UserModel;
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  data: UserModel[];
}

const Users: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen,
  data,
  forceVisible
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const {
    sortedUsers,
    sortBy,
    sortDir,
    onSortChange,
    onSortDirChange,
    nextUserSort,
    userFacingSortBy
  } = useSorting(data);

  const { filteredUsers, onClearSearch, onSearchKeyDown, searchValue } =
    useUsersSearch(sortedUsers);

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
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={onSortChange}
        onSortDirChange={onSortDirChange}
        nextUserSort={nextUserSort}
        userFacingSortBy={userFacingSortBy}
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

import { useMemo } from 'react';
import UserModel from '../../../common/models/user';
import { getLevelName } from '../../../common/utils/userPermissions';

interface useUsersGroupResult {
  userGroups: Map<string, UserModel[]>;
  groups: string[];
}

// Organize user in groups
export default function useUsersGroup(users: UserModel[]): useUsersGroupResult {
  const userGroups = useMemo(() => {
    const userByGroup = new Map();

    const noAccessUsers = users.filter(
      (user) => getLevelName(user, true) === 'noAccess' && !user.isDisabled
    );

    const accessUsers = users.filter(
      (user) => getLevelName(user, true) !== 'noAccess' && !user.isDisabled
    );

    const disabledUsers = users.filter((user) => user.isDisabled);

    if (noAccessUsers.length) {
      userByGroup.set('noAccess', noAccessUsers);
    }

    if (accessUsers.length) {
      userByGroup.set('access', accessUsers);
    }

    if (disabledUsers.length) {
      userByGroup.set('disabled', disabledUsers);
    }

    return userByGroup;
  }, [users]);

  return {
    userGroups,
    groups: Array.from(userGroups.keys())
  };
}

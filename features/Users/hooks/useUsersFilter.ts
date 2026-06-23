import { ChangeEvent, useMemo, useState } from 'react';
import UserModel from '../../../common/models/user';

interface useUsersFilterResult {
  visibleUsers: UserModel[];
  filterBy: string;
  onFilterChange(evt: ChangeEvent<HTMLSelectElement>): void;
}

// Filter users by a selected category
export default function useUsersFilter(
  users: UserModel[]
): useUsersFilterResult {
  const [filterBy, setFilterBy] = useState('');

  const onFilterChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(evt.target.value);
  };

  const visibleUsers = useMemo(() => {
    if (filterBy === 'courtesyOfficer') {
      return users.filter((user) => user.courtesyOfficer);
    }
    return users;
  }, [users, filterBy]);

  return {
    visibleUsers,
    filterBy,
    onFilterChange
  };
}

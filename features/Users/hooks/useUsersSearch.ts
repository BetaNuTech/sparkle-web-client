import { ChangeEvent } from 'react';
import useSearching from '../../../common/hooks/useSearching';
import UserModel from '../../../common/models/user';

interface useUsersSearchResult {
  filteredUsers: UserModel[];
  onClearSearch(): void;
  onSearchKeyDown(evt: ChangeEvent<HTMLInputElement>): void;
  searchValue: string;
}

const attributes = ['email', 'firstName', 'lastName', 'lastUserAgent'];

// Filter users by search query
export default function useUsersSearch(
  users: UserModel[]
): useUsersSearchResult {
  const { filteredItems, onClearSearch, onSearchKeyDown, searchValue } =
    useSearching(users, attributes);

  const filteredUsers = filteredItems.map((item) => item as UserModel);

  return {
    filteredUsers,
    onClearSearch,
    onSearchKeyDown,
    searchValue
  };
}

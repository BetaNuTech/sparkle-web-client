import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import deepClone from '../../../__tests__/helpers/deepClone';
import useUsersFilter from './useUsersFilter';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';

const USERS = [admin, corporate, teamLead, teamMember, propertyMember, noAccess];

describe('Unit | features | Users | Hooks | useUsersFilter', () => {
  test('should return all users when no filter is selected', () => {
    const data = deepClone(USERS);
    const { result } = renderHook(() => useUsersFilter(data));

    expect(result.current.visibleUsers).toHaveLength(USERS.length);
  });

  test('should narrow to only courtesy officers when filtered', () => {
    const data = deepClone(USERS);
    const expected = USERS.filter((user) => user.courtesyOfficer).map(
      (user) => user.id
    );
    const { result } = renderHook(() => useUsersFilter(data));

    act(() => {
      result.current.onFilterChange({
        target: { value: 'courtesyOfficer' }
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    const actual = result.current.visibleUsers.map((user) => user.id);
    expect(actual).toEqual(expected);
    expect(
      result.current.visibleUsers.every((user) => user.courtesyOfficer)
    ).toEqual(true);
  });

  test('should restore all users when filter is cleared', () => {
    const data = deepClone(USERS);
    const { result } = renderHook(() => useUsersFilter(data));

    act(() => {
      result.current.onFilterChange({
        target: { value: 'courtesyOfficer' }
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    act(() => {
      result.current.onFilterChange({
        target: { value: '' }
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.visibleUsers).toHaveLength(USERS.length);
  });
});

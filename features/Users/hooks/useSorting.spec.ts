import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import { shuffle } from '../../../__tests__/helpers/array';
import deepClone from '../../../__tests__/helpers/deepClone';
import useSorting from './useSorting';
import {
  admin,
  corporate,
  teamLead,
  teamMember,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';
import UserModel from '../../../common/models/user';

const USERS = [
  {
    ...admin,
    createdAt: 1,
    lastSignInDate: 6,
    email: 'z@g.co',
    firstName: 'Admin',
    lastName: 'Zser',
    id: 'admin'
  },
  {
    ...corporate,
    createdAt: 2,
    lastSignInDate: 5,
    email: 'c@g.co',
    firstName: 'Corp',
    lastName: 'Orate',
    id: 'corporate'
  },
  {
    ...teamLead,
    createdAt: 3,
    lastSignInDate: 4,
    email: 'tl@g.co',
    firstName: 'Team',
    lastName: 'Lead',
    id: 'team-lead'
  },
  {
    ...teamMember,
    createdAt: 4,
    lastSignInDate: 3,
    email: 'tm@g.co',
    firstName: 'Member',
    lastName: 'Team',
    id: 'team-member'
  },
  {
    ...propertyMember,
    createdAt: 5,
    lastSignInDate: 2,
    email: 'p@g.co',
    firstName: 'Property',
    lastName: 'Manager',
    id: 'property'
  },
  {
    ...noAccess,
    createdAt: 6,
    lastSignInDate: 1,
    email: 'na@g.co',
    firstName: 'No',
    lastName: 'Access',
    id: 'no-access'
  }
];

describe('Unit | features | Users | Hooks | useSorting', () => {
  test('should sort users according to the next sort option', async () => {
    const data = deepClone(USERS);
    const { result } = renderHook(() => useSorting(shuffle(data)));
    const tests = [
      {
        expected:
          '1. admin 2. corporate 3. no-access 4. team-lead 5. team-member 6. property',
        message: 'sorts by access level by default'
      },
      {
        expected:
          '1. corporate 2. no-access 3. property 4. team-lead 5. team-member 6. admin',
        message: 'sorts by email after default'
      },
      {
        expected:
          '1. admin 2. corporate 3. team-member 4. no-access 5. property 6. team-lead',
        message: 'sorts by first name after email'
      },
      {
        expected:
          '1. no-access 2. team-lead 3. property 4. corporate 5. team-member 6. admin',
        message: 'sorts by last name after first name'
      },
      {
        expected:
          '1. no-access 2. property 3. team-member 4. team-lead 5. corporate 6. admin',
        message: 'sorts by created at after last name'
      },
      {
        expected:
          '1. admin 2. corporate 3. team-lead 4. team-member 5. property 6. no-access',
        message: 'sorts by last sign in date after created at'
      },
      {
        expected:
          '1. admin 2. corporate 3. no-access 4. team-lead 5. team-member 6. property',
        message: 'restarts sorting back to access level after sign in date'
      }
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < tests.length; i += 1) {
      const { message, expected } = tests[i];
      const actual = stringifyResult(result.current.sortedUsers);
      expect(actual, message).toEqual(expected);

      // setup next test
      // eslint-disable-next-line
      await act(async () => {
        const beforeSortBy = result.current.sortBy;
        result.current.nextUserSort();
        await waitFor(() => beforeSortBy !== result.current.sortBy);
      });
    }
  });

  test('should sort users according to selected sort option and direction', async () => {
    const data = deepClone(USERS);
    const { result } = renderHook(() => useSorting(shuffle(data)));
    const tests = [
      {
        sortBy: 'email',
        sortDir: 'asc',
        expected:
          '1. corporate 2. no-access 3. property 4. team-lead 5. team-member 6. admin',
        message: 'sorts by email ascending'
      },
      {
        sortBy: 'email',
        sortDir: 'desc',
        expected:
          '1. admin 2. team-member 3. team-lead 4. property 5. no-access 6. corporate',
        message: 'sorts by email descending'
      },
      {
        sortBy: 'firstName',
        sortDir: 'asc',
        expected:
          '1. admin 2. corporate 3. team-member 4. no-access 5. property 6. team-lead',
        message: 'sorts by first name ascending'
      },
      {
        sortBy: 'firstName',
        sortDir: 'desc',
        expected:
          '1. team-lead 2. property 3. no-access 4. team-member 5. corporate 6. admin',
        message: 'sorts by first name descending'
      },
      {
        sortBy: 'lastName',
        sortDir: 'asc',
        expected:
          '1. no-access 2. team-lead 3. property 4. corporate 5. team-member 6. admin',
        message: 'sorts by last name ascending'
      },
      {
        sortBy: 'lastName',
        sortDir: 'desc',
        expected:
          '1. admin 2. team-member 3. corporate 4. property 5. team-lead 6. no-access',
        message: 'sorts by last name descending'
      },
      {
        sortBy: 'createdAt',
        sortDir: 'asc',
        expected:
          '1. admin 2. corporate 3. team-lead 4. team-member 5. property 6. no-access',
        message: 'sorts by created at ascending'
      },
      {
        sortBy: 'createdAt',
        sortDir: 'desc',
        expected:
          '1. no-access 2. property 3. team-member 4. team-lead 5. corporate 6. admin',
        message: 'sorts by created at descending'
      },
      {
        sortBy: 'lastSignInDate',
        sortDir: 'asc',
        expected:
          '1. no-access 2. property 3. team-member 4. team-lead 5. corporate 6. admin',
        message: 'sorts by last sign in date ascending'
      },
      {
        sortBy: 'lastSignInDate',
        sortDir: 'desc',
        expected:
          '1. admin 2. corporate 3. team-lead 4. team-member 5. property 6. no-access',
        message: 'sorts by last sign in date descending'
      }
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < tests.length; i += 1) {
      const { message, expected, sortBy, sortDir } = tests[i];

      // eslint-disable-next-line
      await act(async () => {
        const beforeSortBy = result.current.sortBy;
        result.current.onSortChange({ target: { value: sortBy } });
        await waitFor(() => beforeSortBy !== result.current.sortBy);

        if (sortDir === result.current.sortDir) {
          return;
        }

        const beforeSortDir = result.current.sortDir;
        result.current.onSortDirChange();
        await waitFor(() => beforeSortDir !== result.current.sortDir);
      });

      const actual = stringifyResult(result.current.sortedUsers);
      expect(actual, message).toEqual(expected);
    }
  });
});

function stringifyResult(result: UserModel[]): string {
  return result
    .reduce((acc, user, i) => `${acc}${1 + i}. ${user.id} `, '')
    .trim();
}

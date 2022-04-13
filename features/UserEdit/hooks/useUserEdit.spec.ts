import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useUserEdit, { errors } from './useUserEdit';
import UserModel from '../../../common/models/user';

describe('Unit | Features | Users | Hooks | Use User Edit', () => {
  afterEach(() => sinon.restore());

  test('should not allow user to publish form until it has publishable updates', async () => {
    const { result } = renderHook(() =>
      useUserEdit({ id: 'new' } as UserModel)
    );

    result.current.register('email', {
      required: errors.email
    });
    result.current.register('firstName', {
      required: errors.firstName
    });
    result.current.register('lastName', {
      required: errors.lastName
    });

    // disabled as email, first name and last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('email', 'test@test.com', {
        shouldValidate: true
      });
    });

    // disabled as first name and last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('firstName', 'Dan', {
        shouldValidate: true
      });
    });

    // disabled as last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('lastName', 'Jonas', {
        shouldValidate: true
      });
    });

    // enabled as all required have values
    expect(result.current.isDisabled).toBeFalsy();
  });

  test('should add and remove teams from users selected teams', async () => {
    const teamIds = ['team-1', 'team-2', 'team-3'];
    const { result } = renderHook(() =>
      useUserEdit({ id: 'user-1', teams: { 'team-3': true } } as UserModel)
    );

    const tests = [
      {
        expected: 'team-3 | team-1',
        teamId: teamIds[0],
        message: 'add team id in users selected team'
      },
      {
        expected: 'team-3 | team-1 | team-2',
        teamId: teamIds[1],
        message: 'add another team id in users selected team'
      },
      {
        expected: 'team-3 | team-2',
        teamId: teamIds[0],
        message: 'remove added team id from users selected team'
      },
      {
        expected: 'team-2',
        teamId: teamIds[2],
        message: 'should remove existing team id from selected team'
      },
      {
        expected: 'team-3 | team-2',
        teamId: teamIds[2],
        message: 'should add back existing team id from selected team'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, teamId, message } = tests[i];
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await result.current.onSelectTeam(teamId);
      });

      const actual = result.current.selectedTeams.join(' | ');
      expect(actual, message).toEqual(expected);
    }
  });

  test('should add and remove teams from users publishable team updates', async () => {
    const teamIds = ['team-1', 'team-2', 'team-3'];
    const { result } = renderHook(() =>
      useUserEdit({ id: 'user-1', teams: { 'team-3': true } } as UserModel)
    );

    const tests = [
      {
        expected: 'team-1: true',
        teamId: teamIds[0],
        message: 'add team id in users publishable teams'
      },
      {
        expected: 'team-1: true | team-2: true',
        teamId: teamIds[1],
        message: 'add another team id in users publishable teams'
      },
      {
        expected: 'team-2: true',
        teamId: teamIds[0],
        message: 'remove locally added team from users publishable teams'
      },
      {
        expected: 'team-2: true | team-3: false',
        teamId: teamIds[2],
        message:
          'should remove, previously published, team from publishable teams'
      },
      {
        expected: 'team-2: true',
        teamId: teamIds[2],
        message: 'should remove, already published, team from publishable teams'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, teamId, message } = tests[i];
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await result.current.onSelectTeam(teamId);
      });

      const currentResult = result.current.updates || ({} as UserModel);
      const actual = Object.entries(currentResult.teams || {})
        .sort(
          ([teamAId], [teamBId]) =>
            teamIds.indexOf(teamAId) - teamIds.indexOf(teamBId)
        )
        .map(([id, value]) => `${id}: ${value}`)
        .join(' | ');
      expect(actual, message).toEqual(expected);
    }
  });
});

import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userApi from '../../../common/services/api/users';
import useUserEdit, {
  errors,
  USER_NOTIFICATIONS_CREATE,
  USER_NOTIFICATIONS_UPDATE
} from './useUserEdit';
import UserModel from '../../../common/models/user';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import { admin } from '../../../__mocks__/users';
import wait from '../../../__tests__/helpers/wait';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorBadRequest from '../../../common/models/errors/badRequest';

describe('Unit | Features | Users | Hooks | Use User Edit', () => {
  afterEach(() => sinon.restore());

  test('should not allow user to publish form until it has publishable updates', async () => {
    const { result } = renderHook(() =>
      useUserEdit({ id: 'new' } as UserModel, sinon.spy())
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
      useUserEdit(
        { id: 'user-1', teams: { 'team-3': true } } as UserModel,
        sinon.spy()
      )
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
      useUserEdit(
        { id: 'user-1', teams: { 'team-3': true } } as UserModel,
        sinon.spy()
      )
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

  test('should add and remove properties from users selected properties', async () => {
    const propertyIds = ['property-1', 'property-2', 'property-3'];
    const { result } = renderHook(() =>
      useUserEdit(
        {
          id: 'user-1',
          properties: { 'property-3': true }
        } as UserModel,
        sinon.spy()
      )
    );

    const tests = [
      {
        expected: 'property-3 | property-1',
        propertyId: propertyIds[0],
        message: 'add property id in users selected property'
      },
      {
        expected: 'property-3 | property-1 | property-2',
        propertyId: propertyIds[1],
        message: 'add another property id in users selected property'
      },
      {
        expected: 'property-3 | property-2',
        propertyId: propertyIds[0],
        message: 'remove added property id from users selected property'
      },
      {
        expected: 'property-2',
        propertyId: propertyIds[2],
        message: 'should remove existing property id from selected property'
      },
      {
        expected: 'property-3 | property-2',
        propertyId: propertyIds[2],
        message: 'should add back existing property id from selected property'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, propertyId, message } = tests[i];
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await result.current.onSelectProperty(propertyId);
      });

      const actual = result.current.selectedProperties.join(' | ');
      expect(actual, message).toEqual(expected);
    }
  });

  test('should add and remove properties from users publishable property updates', async () => {
    const propertyIds = ['property-1', 'property-2', 'property-3'];
    const { result } = renderHook(() =>
      useUserEdit(
        {
          id: 'user-1',
          properties: { 'property-3': true }
        } as UserModel,
        sinon.spy()
      )
    );

    const tests = [
      {
        expected: 'property-1: true',
        propertyId: propertyIds[0],
        message: 'add property id in users publishable properties'
      },
      {
        expected: 'property-1: true | property-2: true',
        propertyId: propertyIds[1],
        message: 'add another property id in users publishable properties'
      },
      {
        expected: 'property-2: true',
        propertyId: propertyIds[0],
        message:
          'remove locally added property from users publishable properties'
      },
      {
        expected: 'property-2: true | property-3: false',
        propertyId: propertyIds[2],
        message:
          'should remove, previously published, property from publishable properties'
      },
      {
        expected: 'property-2: true',
        propertyId: propertyIds[2],
        message:
          'should remove, already published, property from publishable properties'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, propertyId, message } = tests[i];
      // eslint-disable-next-line no-await-in-loop
      await act(async () => {
        await result.current.onSelectProperty(propertyId);
      });

      const currentResult = result.current.updates || ({} as UserModel);
      const actual = Object.entries(currentResult.properties || {})
        .sort(
          ([propertyAId], [propertyBId]) =>
            propertyIds.indexOf(propertyAId) - propertyIds.indexOf(propertyBId)
        )
        .map(([id, value]) => `${id}: ${value}`)
        .join(' | ');
      expect(actual, message).toEqual(expected);
    }
  });

  test('should show user facing error message according to error type while creating user', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS_CREATE.forbidden,
        message: 'show email already exist message for forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS_CREATE.unpermissioned,
        message: 'show permission error for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS_CREATE.internalServer,
        message: 'show unknown error for internal server error'
      },
      {
        expected: USER_NOTIFICATIONS_CREATE.success,
        message: 'show success on successful request'
      }
    ];

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(userApi, 'createRecord')
      .onCall(0)
      .rejects(new ErrorForbidden())
      .onCall(1)
      .rejects(new ErrorUnauthorized())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .resolves();

    const { result } = renderHook(() => useUserEdit(admin, sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.onCreateUser();
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should show user facing error message according to error type while updating user', async () => {
    const sendNotification = sinon.spy();
    const badRequestErrorText = 'update user bad request ';
    const badRequestError = new ErrorBadRequest('bad request');
    badRequestError.addErrors([{ detail: badRequestErrorText }]);

    const tests = [
      {
        expected: USER_NOTIFICATIONS_UPDATE.notFound,
        message: 'show no longer exist message for not found request'
      },
      {
        expected: USER_NOTIFICATIONS_UPDATE.unpermissioned,
        message: 'show permission error for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS_UPDATE.unpermissioned,
        message: 'show permission error for forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS_UPDATE.internalServer,
        message: 'show unknown error for internal server error'
      },
      {
        expected: badRequestErrorText,
        message: 'shows error from api response for bad request'
      },
      {
        expected: USER_NOTIFICATIONS_UPDATE.success,
        message: 'show success on successful request'
      }
    ];

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(userApi, 'updateRecord')
      .onCall(0)
      .rejects(new ErrorNotFound())
      .onCall(1)
      .rejects(new ErrorUnauthorized())
      .onCall(2)
      .rejects(new ErrorForbidden())
      .onCall(3)
      .rejects(new ErrorServerInternal())
      .onCall(4)
      .rejects(badRequestError)
      .onCall(5)
      .resolves();

    const { result } = renderHook(() => useUserEdit(admin, sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.onUpdateUser();
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });
});

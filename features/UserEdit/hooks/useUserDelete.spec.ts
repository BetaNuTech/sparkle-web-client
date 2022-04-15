import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userApi from '../../../common/services/api/users';
import useUserDelete, { USER_NOTIFICATIONS } from './useUserDelete';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import { admin } from '../../../__mocks__/users';
import wait from '../../../__tests__/helpers/wait';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

describe('Unit | Features | Users | Hooks | Use User Delete', () => {
  afterEach(() => sinon.restore());

  test('should show user facing error message according to error type', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS.notFound,
        message: 'show no longer exist message for not found request'
      },
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error for unauthorised request'
      },
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error for forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS.internalServer,
        message: 'show unknown error for internal server error'
      }
    ];

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(userApi, 'deleteRecord')
      .onCall(0)
      .rejects(new ErrorNotFound())
      .onCall(1)
      .rejects(new ErrorUnauthorized())
      .onCall(2)
      .rejects(new ErrorForbidden())
      .onCall(3)
      .rejects(new ErrorServerInternal());

    const { result } = renderHook(() => useUserDelete(admin, sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.onDelete();
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });
});

import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import authApi from '../../../common/services/auth';

import ErrorBadRequest from '../../../common/models/errors/badRequest';
import wait from '../../../__tests__/helpers/wait';
import useLogin, { USER_NOTIFICATIONS } from './useLogin';
import winLocation from '../../../common/utils/winLocation';

describe('Unit | Features | Login | Hooks | UseLogin', () => {
  afterEach(() => sinon.restore());

  test('should show user facing error message according to error type', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS.invalidPassword,
        message: 'show invalid password error message for bad request'
      },
      {
        expected: USER_NOTIFICATIONS.generic,
        message:
          'show invalid template updates error for unknown or unexpected errors'
      }
    ];

    sinon
      .stub(authApi, 'signInWithEmailAndPassword')
      .onCall(0)
      .rejects(new ErrorBadRequest())
      .onCall(1)
      .rejects(new Error());

    const { result } = renderHook(() => useLogin(sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.signIn('test@test.com', 'password');
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should redirect to properties page on successful login', async () => {
    const expected = '/properties';
    const sendNotification = sinon.spy();

    sinon.stub(authApi, 'signInWithEmailAndPassword').resolves();
    const setHref = sinon.stub(winLocation, 'setHref');

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signIn('test@test.com', 'password');
      await wait(100);
    });

    const actual = setHref.getCall(0).args[0];
    expect(actual).toEqual(expected);
  });
});

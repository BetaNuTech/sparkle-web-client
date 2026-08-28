import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import authApi, { REFUSAL_NOT_SET_UP } from '../../../common/services/auth';

import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import wait from '../../../__tests__/helpers/wait';
import useLogin, {
  USER_NOTIFICATIONS,
  USER_NOTIFICATIONS_GOOGLE,
  USER_NOTIFICATIONS_FORGOT_PASSWORD
} from './useLogin';
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
    const expected = 'http://localhost/properties';
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

  test('should sign a google user in and redirect on success', async () => {
    const expected = 'http://localhost/properties';
    const sendNotification = sinon.spy();

    sinon.stub(authApi, 'signInWithGoogle').resolves({ user: { uid: '123' } });
    sinon.stub(authApi, 'hasUserRecord').resolves(true);
    const setHref = sinon.stub(winLocation, 'setHref');

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signInWithGoogle();
      await wait(100);
    });

    expect(setHref.getCall(0).args[0]).toEqual(expected);
    expect(sendNotification.called, 'sends no notification on success').toEqual(
      false
    );
  });

  test('should stay silent when the user dismisses the google popup', async () => {
    const sendNotification = sinon.spy();

    // The service resolves null when the person closed the window without
    // choosing an account: not a failure, and not worth a toast
    sinon.stub(authApi, 'signInWithGoogle').resolves(null);
    const setHref = sinon.stub(winLocation, 'setHref');

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signInWithGoogle();
      await wait(100);
    });

    expect(sendNotification.called, 'shows no error').toEqual(false);
    expect(setHref.called, 'does not redirect').toEqual(false);
    expect(
      result.current.hasLoginError,
      'does not force the password form open'
    ).toEqual(false);
  });

  test('should surface the auth gate refusal copy verbatim', async () => {
    const expected =
      'That Google account is not set up in Sparkle. Please ask an administrator to add you.';
    const sendNotification = sinon.spy();

    sinon.stub(authApi, 'signInWithGoogle').rejects(new ErrorForbidden(expected));

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signInWithGoogle();
      await wait(100);
    });

    expect(sendNotification.getCall(0).args[0]).toEqual(expected);
    expect(
      result.current.hasLoginError,
      'forces the password form open so the user has an alternative'
    ).toEqual(true);
  });

  test('should refuse a google sign in when firebase sign-up is disabled', async () => {
    const sendNotification = sinon.spy();

    // What Firebase raises when "Enable create (sign-up)" is unchecked: the
    // Google identity has no Sparkle account and Firebase will not make one
    sinon
      .stub(authApi, 'signInWithGoogle')
      .rejects(new ErrorForbidden(REFUSAL_NOT_SET_UP));
    const setHref = sinon.stub(winLocation, 'setHref');

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signInWithGoogle();
      await wait(100);
    });

    expect(sendNotification.getCall(0).args[0]).toEqual(REFUSAL_NOT_SET_UP);
    expect(setHref.called, 'does not redirect into the app').toEqual(false);
    expect(
      result.current.hasLoginError,
      'opens the password form as an alternative'
    ).toEqual(true);
  });

  test('should show google specific error messages by error type', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS_GOOGLE.popupBlocked,
        message: 'show popup blocked message for bad request'
      },
      {
        expected: USER_NOTIFICATIONS_GOOGLE.generic,
        message: 'show generic message for unknown or unexpected errors'
      }
    ];

    sinon
      .stub(authApi, 'signInWithGoogle')
      .onCall(0)
      .rejects(new ErrorBadRequest())
      .onCall(1)
      .rejects(new Error());

    const { result } = renderHook(() => useLogin(sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.signInWithGoogle();
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should sign out a google user with no sparkle record', async () => {
    const sendNotification = sinon.spy();

    // Authenticated to Google, but there is no users record for them. The
    // blocking function should have stopped this, so reaching here means an
    // auth account exists without a profile.
    sinon.stub(authApi, 'signInWithGoogle').resolves({ user: { uid: '123' } });
    sinon.stub(authApi, 'hasUserRecord').resolves(false);
    const signOut = sinon.stub(authApi, 'signOut').resolves();
    const setHref = sinon.stub(winLocation, 'setHref');

    const { result } = renderHook(() => useLogin(sendNotification));
    await act(async () => {
      result.current.signInWithGoogle();
      await wait(100);
    });

    expect(signOut.called, 'terminates the half usable session').toEqual(true);
    expect(setHref.called, 'does not redirect into the app').toEqual(false);
    expect(sendNotification.getCall(0).args[0]).toEqual(
      USER_NOTIFICATIONS_GOOGLE.notSetUp
    );
  });

  test('should force the password disclosure open after a failed password sign in', async () => {
    const sendNotification = sinon.spy();
    sinon.stub(authApi, 'signInWithEmailAndPassword').rejects(new Error());

    const { result } = renderHook(() => useLogin(sendNotification));
    expect(result.current.hasLoginError, 'starts collapsed').toEqual(false);

    await act(async () => {
      result.current.signIn('test@test.com', 'password');
      await wait(100);
    });

    expect(result.current.hasLoginError).toEqual(true);
  });

  test('should show user facing error or success message for forgot password request', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS_FORGOT_PASSWORD.invalidEmail,
        message: 'show no user record found error message for bad request'
      },
      {
        expected: USER_NOTIFICATIONS_FORGOT_PASSWORD.generic,
        message:
          'show invalid template updates error for unknown or unexpected errors'
      },
      {
        expected: USER_NOTIFICATIONS_FORGOT_PASSWORD.success,
        message: 'show success message on successfull response'
      }
    ];

    sinon
      .stub(authApi, 'sendPasswordResetEmail')
      .onCall(0)
      .rejects(new ErrorBadRequest())
      .onCall(1)
      .rejects(new Error())
      .onCall(2)
      .resolves();

    const { result } = renderHook(() => useLogin(sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.forgotPassword('test@test.com');
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });
});

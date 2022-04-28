import sinon from 'sinon';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import trelloApi from '../../../common/services/api/trello';
import useTrello, {
  USER_NOTIFICATIONS,
  USER_NOTIFICATIONS_DELETE
} from './useTrello';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import ErrorBadRequest from '../../../common/models/errors/badRequest';

describe('Unit | Features | Settings | Hooks | Use Trello', () => {
  afterEach(() => sinon.restore());

  test('should show user facing error message according to error type while authrizing trello', async () => {
    const sendNotification = sinon.spy();
    const badRequestErrorText = 'authorize trello bad request ';
    const badRequestError = new ErrorBadRequest('bad request');
    badRequestError.addErrors([{ detail: badRequestErrorText }]);

    const tests = [
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error for forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS.internalServer,
        message: 'show unknown error for internal server error'
      },
      {
        expected: badRequestErrorText,
        message: 'shows error from api response for bad request'
      },
      {
        expected: USER_NOTIFICATIONS.badRequest,
        message: 'shows bad request error for bad request'
      }
    ];

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(trelloApi, 'createAuthorization')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorForbidden())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .onCall(3)
      .rejects(badRequestError)
      .onCall(4)
      .rejects(new ErrorBadRequest());

    const { result } = renderHook(() => useTrello(sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.onAuthorizeTrello('');
        await waitFor(() => sendNotification.called);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should show user facing error message according to error type while delete trello authorization', async () => {
    const sendNotification = sinon.spy();
    const badRequestErrorText = 'delete trello authorization bad request';
    const badRequestError = new ErrorBadRequest('bad request');
    badRequestError.addErrors([{ detail: badRequestErrorText }]);
    const tests = [
      {
        expected: USER_NOTIFICATIONS_DELETE.unpermissioned,
        message: 'show permission error for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS_DELETE.unpermissioned,
        message: 'show permission error for forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS_DELETE.internalServer,
        message: 'show unknown error for internal server error'
      },
      {
        expected: badRequestErrorText,
        message: 'shows error from api response for bad request'
      },
      {
        expected: USER_NOTIFICATIONS_DELETE.badRequest,
        message: 'shows bad request error for bad request'
      }
    ];

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(trelloApi, 'deleteAuthorization')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorForbidden())
      .onCall(2)
      .rejects(new ErrorServerInternal())
      .rejects(badRequestError)
      .onCall(4)
      .rejects(new ErrorBadRequest());

    const { result } = renderHook(() => useTrello(sendNotification));

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.onDelete();
        await waitFor(() => sendNotification.called);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should set error and keep token on failing to authorize trello ', async () => {
    const expectedToken = 'token_123';
    const sendNotification = sinon.spy();

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(trelloApi, 'createAuthorization')
      .rejects(new ErrorUnauthorized());

    const { result } = renderHook(() => useTrello(sendNotification));

    await act(async () => {
      result.current.onAuthorizeTrello(expectedToken);
      await waitFor(() => sendNotification.called);
    });
    expect(result.current.hasError).toBeTruthy();
    expect(result.current.token).toEqual(expectedToken);
  });

  test('should remove error and destroy token on success of authorize trello ', async () => {
    const expectedToken = 'token_123';
    const sendNotification = sinon.spy();

    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(trelloApi, 'createAuthorization')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .resolves();

    const { result } = renderHook(() => useTrello(sendNotification));

    await act(async () => {
      result.current.onAuthorizeTrello(expectedToken);
    });
    // set error and keep token
    expect(result.current.hasError).toBeTruthy();
    expect(result.current.token).toEqual(expectedToken);

    await act(async () => {
      result.current.reAuthorize();
    });

    // remove error and destroy token
    expect(result.current.hasError).toBeFalsy();
    expect(result.current.token).toBeNull();
  });
});

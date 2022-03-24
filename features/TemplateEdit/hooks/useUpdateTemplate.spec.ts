import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import templatesApi from '../../../common/services/api/templates';

import useUpdateTemplate, { USER_NOTIFICATIONS } from './useUpdateTemplate';
import { templateA } from '../../../__mocks__/templates';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import wait from '../../../__tests__/helpers/wait';
import errorReports from '../../../common/services/api/errorReports';

describe('Unit | Features | Template Edit | Hooks | Use Update Template', () => {
  afterEach(() => sinon.restore());

  test('should show user facing error message according to error type', async () => {
    const sendNotification = sinon.spy();

    const tests = [
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show generic error message for unauthorized request'
      },
      {
        expected: USER_NOTIFICATIONS.badRequest,
        message: 'show invalid template updates error for bad request'
      },
      {
        expected: USER_NOTIFICATIONS.unpermissioned,
        message: 'show permission error on forbidden request'
      },
      {
        expected: USER_NOTIFICATIONS.generic,
        message: 'show generic error message for not found request'
      },
      {
        expected: USER_NOTIFICATIONS.generic,
        message: 'show generic error message for internal server error'
      }
    ];
    sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(templatesApi, 'updateRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorBadRequest())
      .onCall(2)
      .rejects(new ErrorForbidden())
      .onCall(3)
      .rejects(new ErrorNotFound())
      .onCall(4)
      .rejects(new ErrorServerInternal());

    const { result } = renderHook(() =>
      useUpdateTemplate('template-1', templateA, {}, sendNotification)
    );

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.updateTemplate();
        await wait(100);
      });
      const actual = sendNotification.getCall(i).args[0];
      expect(actual, message).toEqual(expected);
    }
  });

  test('should send a unique system error report for each error type', async () => {
    const tests = [
      {
        expected:
          'Error: features: TemplateEdit: hooks: useUpdateTemplate: handleErrorResponse: ErrorUnauthorized',
        message: 'sends unauthorized error report'
      },
      {
        expected:
          'Error: features: TemplateEdit: hooks: useUpdateTemplate: handleErrorResponse: ErrorBadRequest',
        message: 'sends bad request error report'
      },
      {
        expected:
          'Error: features: TemplateEdit: hooks: useUpdateTemplate: handleErrorResponse: ErrorForbidden',
        message: 'sends forbidden error report'
      },
      {
        expected:
          'Error: features: TemplateEdit: hooks: useUpdateTemplate: handleErrorResponse: ErrorNotFound',
        message: 'sends not found error report'
      },
      {
        expected:
          'Error: features: TemplateEdit: hooks: useUpdateTemplate: handleErrorResponse: ErrorServerInternal',
        message: 'sends internal server error report'
      }
    ];
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    sinon
      .stub(templatesApi, 'updateRecord')
      .onCall(0)
      .rejects(new ErrorUnauthorized())
      .onCall(1)
      .rejects(new ErrorBadRequest())
      .onCall(2)
      .rejects(new ErrorForbidden())
      .onCall(3)
      .rejects(new ErrorNotFound())
      .onCall(4)
      .rejects(new ErrorServerInternal());

    const { result } = renderHook(() =>
      useUpdateTemplate('template-1', templateA, {}, sinon.spy())
    );

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, message } = tests[i];
      // eslint-disable-next-line
      await act(async () => {
        result.current.updateTemplate();
        await wait(100);
      });
      const actual = `${sendReport.getCall(i).args[0] || new Error()}`;
      expect(actual, message).toEqual(expected);
    }
  });
});

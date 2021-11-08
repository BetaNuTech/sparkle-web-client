import create, { DEFAULT_ERROR_MESSAGES } from './createError';
import ErrorBadRequest from '../../models/errors/badRequest';
import ErrorConflictingRequest from '../../models/errors/conflictingRequest';
import ErrorForbidden from '../../models/errors/forbidden';
import ErrorNotFound from '../../models/errors/notFound';
import ErrorProxyForbidden from '../../models/errors/proxyForbidden';
import ErrorServerInternal from '../../models/errors/serverInternal';

const GENERIC_JSON_ERROR = Object.freeze({
  source: { pointer: 'body' },
  title: 'Bad Request',
  detail: 'Request Error'
});

describe('Unit | Common | Utils | API | Create Error', () => {
  test('it should create error for all api errors types', () => {
    const tests = [
      {
        status: 400,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorBadRequest,
        msg: 'created bad request error'
      },
      {
        status: 403,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorForbidden,
        msg: 'created forbidden request error'
      },
      {
        status: 404,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorNotFound,
        msg: 'created not found request error'
      },
      {
        status: 407,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorProxyForbidden,
        msg: 'created proxy forbidden request error'
      },
      {
        status: 409,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorConflictingRequest,
        msg: 'created conflicting request error'
      },
      {
        status: 500,
        errors: [GENERIC_JSON_ERROR],
        expected: ErrorServerInternal,
        msg: 'created internal system error'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { status, errors, expected, msg } = tests[i];
      const result: any = create('err')(status, errors);
      const actual = result instanceof expected;
      expect(actual, msg).toEqual(true);
    }
  });

  test('it should use each api errors default message', () => {
    const tests = [
      {
        status: 400,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[400],
        msg: 'used bad request default message'
      },
      {
        status: 403,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[403],
        msg: 'used forbidden request default message'
      },
      {
        status: 404,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[404],
        msg: 'used not found request default message'
      },
      {
        status: 407,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[407],
        msg: 'used proxy conflict request default message'
      },
      {
        status: 409,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[409],
        msg: 'used conflicting request default message'
      },
      {
        status: 500,
        errors: [GENERIC_JSON_ERROR],
        expected: DEFAULT_ERROR_MESSAGES[500],
        msg: 'used internal system request default message'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { status, errors, expected, msg } = tests[i];
      const result: any = create('')(status, errors);
      const actual = `${result.message || ''}`.trim();
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should use each api errors custom message', () => {
    const customMessages = {
      400: 'custom fix request error',
      403: 'custom user lacks permission',
      404: 'custom record not found',
      407: 'custom 3rd party service not authenticated',
      409: 'custom fix conflicting request errors',
      500: 'custom system failure'
    };
    const tests = [
      {
        status: 400,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[400],
        msg: 'used bad request custom message'
      },
      {
        status: 403,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[403],
        msg: 'used forbidden request custom message'
      },
      {
        status: 404,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[404],
        msg: 'used not found request custom message'
      },
      {
        status: 407,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[407],
        msg: 'used proxy conflict request custom message'
      },
      {
        status: 409,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[409],
        msg: 'used conflicting request custom message'
      },
      {
        status: 500,
        errors: [GENERIC_JSON_ERROR],
        expected: customMessages[500],
        msg: 'used internal system request custom message'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { status, errors, expected, msg } = tests[i];
      const result: any = create('', customMessages)(status, errors);
      const actual = `${result.message || ''}`.trim();
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it should return a falsey value when status is successful', () => {
    const expected = false;
    const actual = Boolean(create('')(201, []));
    expect(actual).toEqual(expected);
  });
});

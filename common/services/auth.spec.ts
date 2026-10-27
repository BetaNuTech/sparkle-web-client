import { readBlockingFunctionMessage, REFUSAL_NOT_SET_UP } from './auth';

const REFUSAL =
  'That Google account is not set up in Sparkle. Please ask an administrator to add you.';

describe('Unit | Common | Services | Auth', () => {
  test('refusal copy names Google and points at an administrator', () => {
    // Shown to anyone whose Google account has no Sparkle record. It must not
    // imply they can fix it themselves: only an administrator can add them.
    expect(REFUSAL_NOT_SET_UP).toContain('Google account');
    expect(REFUSAL_NOT_SET_UP).toContain('administrator');
  });

  describe('readBlockingFunctionMessage', () => {
    test('extracts the refusal from the nested, escaped identity platform shape', () => {
      // What the Firebase JS SDK actually surfaces: the auth gate's HttpsError
      // wrapped in the Cloud Function response, wrapped again in the Identity
      // Toolkit error, with the inner quotes escaped
      const err = {
        code: 'auth/internal-error',
        message:
          'Firebase: HTTP Cloud Function returned an error: {"error":{"code":400,' +
          '"message":"BLOCKING_FUNCTION_ERROR_RESPONSE : HTTP Cloud Function returned an error: ' +
          `{\\"error\\":{\\"message\\":\\"${REFUSAL}\\",\\"status\\":\\"PERMISSION_DENIED\\"}}"}} ` +
          '(auth/internal-error).'
      };

      expect(readBlockingFunctionMessage(err)).toEqual(REFUSAL);
    });

    test('extracts the refusal from the flat, unescaped shape', () => {
      const err = {
        code: 'auth/internal-error',
        message:
          'BLOCKING_FUNCTION_ERROR_RESPONSE : HTTP Cloud Function returned an error: ' +
          `{"error":{"message":"${REFUSAL}","status":"PERMISSION_DENIED"}}`
      };

      expect(readBlockingFunctionMessage(err)).toEqual(REFUSAL);
    });

    test('returns an empty string for errors that are not blocking function refusals', () => {
      const cases = [
        { code: 'auth/popup-blocked', message: 'Firebase: popup blocked.' },
        { code: 'auth/network-request-failed', message: 'Firebase: network.' },
        { message: '' },
        {},
        undefined,
        null
      ];

      cases.forEach(err => {
        expect(readBlockingFunctionMessage(err)).toEqual('');
      });
    });

    test('returns an empty string when the marker is present but no message follows', () => {
      const err = {
        code: 'auth/internal-error',
        message: 'BLOCKING_FUNCTION_ERROR_RESPONSE : something unparseable'
      };

      expect(readBlockingFunctionMessage(err)).toEqual('');
    });

    test('ignores a message key that appears before the marker', () => {
      const err = {
        code: 'auth/internal-error',
        message:
          '{"message":"an outer wrapper we do not want"} ' +
          'BLOCKING_FUNCTION_ERROR_RESPONSE : ' +
          `{"error":{"message":"${REFUSAL}"}}`
      };

      expect(readBlockingFunctionMessage(err)).toEqual(REFUSAL);
    });
  });
});

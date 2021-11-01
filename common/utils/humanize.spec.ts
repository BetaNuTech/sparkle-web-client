import * as humanize from './humanize';

describe('Unit | Common | Utils | Humanize', () => {
  test('it converts phone numbers to a human readable format', () => {
    const tests = [
      {
        input: '5555555555',
        expected: '(555) 555-5555',
        msg: 'converts digit only input to phone number'
      },
      {
        input: '(555) 5555555',
        expected: '(555) 555-5555',
        msg: 'converts add missing dash'
      },
      {
        input: '555555-5555',
        expected: '(555) 555-5555',
        msg: 'converts add missing space parens'
      },
      {
        input: '555555',
        expected: '(555) 555',
        msg: 'converts first part of valid phone number'
      },
      {
        input: '+15555555555',
        expected: '(555) 555-5555',
        msg: 'removes international number'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { input, expected, msg } = tests[i];
      const actual = humanize.phoneNumber(input);
      expect(actual, msg).toEqual(expected);
    }
  });
});

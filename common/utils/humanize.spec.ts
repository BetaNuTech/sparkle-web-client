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

  test('it converts strings and numbers to USD formatted money strings', () => {
    const tests = [
      {
        input: 1.1,
        expected: '$1.10',
        msg: 'converts floating number to money'
      },
      {
        input: '1.1',
        expected: '$1.10',
        msg: 'converts floating point string to money'
      },
      {
        input: 0,
        expected: '$0.00',
        msg: 'converts zero to a zero string'
      },
      {
        input: 1000,
        expected: '$1,000.00',
        msg: 'converts 1000 to 1,000'
      },
      {
        input: '1.1',
        decimals: false,
        expected: '$1',
        msg: 'converts removes decimal points when requested'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { input, expected, decimals = true, msg } = tests[i];
      const actual = humanize.moneyUsd(input, decimals);
      expect(actual, msg).toEqual(expected);
    }
  });
});

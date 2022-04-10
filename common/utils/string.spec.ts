import utilString from './string';

describe('Unit | Common | Utils | String', () => {
  test('it make the first letter of each word after space to capital', () => {
    const expected = 'Matt Jensen';

    const actual = utilString.titleize('matt jensen');
    expect(actual).toEqual(expected);
  });

  test('it returns array of keywords in a word set in lower case', () => {
    const expected = 'matt | jensen';

    const actual = utilString.getSearchKeywords('Matt Jensen').join(' | ');
    expect(actual).toEqual(expected);
  });

  test('it returns array of keywords in a word set in lower case without empty set', () => {
    const expected = 'matt | jensen';

    const actual = utilString.getSearchKeywords('Matt  Jensen ').join(' | ');
    expect(actual).toEqual(expected);
  });

  test('it formats a number in to a valid currency', () => {
    [
      {
        data: 0,
        expected: '0'
      },
      {
        data: 1,
        expected: '1'
      },
      {
        data: 9999,
        expected: '9,999'
      },
      {
        data: 1000001,
        expected: '1,000,001'
      },
      {
        data: 1.01,
        expected: '1.01'
      },
      {
        data: 1.019999,
        expected: '1.02'
      }
    ].forEach(({ data, expected }) => {
      const actual = utilString.getFormattedCurrency(data);
      expect(actual).toEqual(expected);
    });
  });

  test('it truncates a strings to a maximum length', () => {
    [
      {
        data: 'small string',
        expected: 'small string'
      },
      {
        data: 'long string gets truncated',
        expected: 'long string g...'
      }
    ].forEach(({ data, expected }) => {
      const actual = utilString.truncate(data, 13, '...');
      expect(actual).toEqual(expected);
    });
  });

  test('it converts a camel cased string to a spaced string', () => {
    const expected = 'camel Cased String';
    const actual = utilString.decamel('camelCasedString');
    expect(actual).toEqual(expected);
  });
});

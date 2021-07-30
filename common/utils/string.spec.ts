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
});

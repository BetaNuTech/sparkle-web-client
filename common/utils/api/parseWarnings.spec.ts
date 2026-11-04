import parseWarnings from './parseWarnings';

describe('Unit | Common | Utils | API | Parse Warnings', () => {
  test('it returns no warnings when a payload has no meta warnings', () => {
    const expected = [];
    [undefined, null, {}, { meta: {} }, { meta: { warnings: 'nope' } }].forEach(
      (payload) => {
        expect(parseWarnings(payload)).toEqual(expected);
      }
    );
  });

  test('it normalizes meta warnings and ignores malformed entries', () => {
    const expected = [
      {
        id: 'inspection-1',
        type: 'inspection',
        title: 'Photos still uploading',
        detail: 'inspection "inspection-1" has 2 photo(s) still uploading'
      },
      { title: '', detail: 'missing title' }
    ];

    const actual = parseWarnings({
      meta: {
        warnings: [
          {
            id: 'inspection-1',
            type: 'inspection',
            title: 'Photos still uploading',
            detail: 'inspection "inspection-1" has 2 photo(s) still uploading'
          },
          null,
          'not an object',
          { detail: 'missing title' }
        ]
      }
    });

    expect(actual).toEqual(expected);
  });
});

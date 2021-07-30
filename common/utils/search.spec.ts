import utilSearch from './search';

const records = [
  { id: '1', name: 'Matt Jensen', country: 'US', color: 'red' },
  { id: '2', name: 'Thomas Cook', country: 'UK', color: 'green' },
  { id: '3', name: 'James Bond', country: 'RS', color: 'yellow' }
];

describe('Unit | Common | Utils | Helpers', () => {
  test('it makes id based search index from given attibutes', () => {
    const expected =
      '{"1":"matt jensen red","2":"thomas cook green","3":"james bond yellow"}';

    const searchIdx = utilSearch.createSearchIndex(records, ['name', 'color']);

    const actual = JSON.stringify(searchIdx);

    expect(actual).toEqual(expected);
  });

  test('it filters the search index based on given query', () => {
    const expected = '["1","3"]';

    const searchIdx = utilSearch.createSearchIndex(records, ['name', 'color']);

    const filteredIds = utilSearch.querySearchIndex(searchIdx, [
      'matt',
      'bond'
    ]);

    const actual = JSON.stringify(filteredIds);

    expect(actual).toEqual(expected);
  });
});
